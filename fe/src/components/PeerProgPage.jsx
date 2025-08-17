import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript'; 
import { python } from '@codemirror/lang-python'; 
import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java'; 
import socket from "./Socket"; 
import createSubmission from './CodeExecution';
import { Button, Typography, TextField, Select } from './ui';
import { colors, shadows } from '../theme';

const PeerProgPage = ({ setRoomid, roomid, setJoinedRoom, joinedRoom }) => {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("");
  const [isRoomJoined, setIsRoomJoined] = useState(false);
  const [id, setId] = useState(0);
  const [stdOutput, setStdOutput] = useState("");
  const [stdInput, setStdInput] = useState("");
  const roomInputRef = useRef("");

  useEffect(() => {
    socket.on("connect", () => console.log(socket.id));
    socket.on("send-code", (NewCode) => setCode(NewCode));
    socket.on("send-input", (inputValue) => setStdInput(inputValue));
    socket.on("send-output", (outputVal) => setStdOutput(outputVal));
    socket.on("send-language", (newLanguage) => setLanguage(newLanguage));
    

    return () => {
      socket.off("send-code");
      socket.off("send-input");
      socket.off("send-output");
      socket.off("send-language");
    };
  }, []);

  const updateCode = useCallback((NewCode) => {
    setCode(NewCode);
    if (roomid !== "") socket.emit("update-code", { NewCode, roomid });
  }, [roomid]);

  const joinRoom = useCallback((e) => {
    e.preventDefault();
    if (roomid.trim() === "") {
      alert('Please enter a room ID');
      return;
    }

    console.log("Joining room:", roomid);
    socket.emit("join-room", roomid);
    setJoinedRoom(roomid);
    setIsRoomJoined(true);
    roomInputRef.current.value = "";
  }, [roomid, setJoinedRoom]);

  const disconnectRoom = useCallback(() => {
    if (!joinedRoom) return;

    console.log("Disconnecting from room:", joinedRoom);
    socket.emit("disconnect-room", joinedRoom);

    setIsRoomJoined(false);
    setJoinedRoom("");
    setRoomid("");
  }, [joinedRoom, setJoinedRoom, setRoomid]);

  const runCode = useCallback(async () => {
    if (code.trim() === "") return;
    if (language === '') {
      alert('Please choose your language');
      return;
    }
    try {
      const result = await createSubmission(id, code, stdInput.trim() !== "" ? stdInput : null);

      if (result?.output) {
        setStdOutput(result.output);
        if (roomid !== "") socket.emit("update-output", { outputVal: result.output, roomid });
      }
    } catch (error) {
      console.error("Execution error:", error);
      setStdOutput("Error executing code.");
    }
  }, [code, id, stdInput, roomid]);

  const updateInput = useCallback((inputValue) => {
    setStdInput(inputValue);
    if (roomid !== "") socket.emit("update-input", { inputValue, roomid });
  }, [roomid]);

  const updateLang = useCallback((newLang) => {
    setLanguage(newLang);
    let newId;
  
    switch (newLang) {
      case "python": newId = 92; break;
      case "cpp": newId = 54; break;
      case "java": newId = 91; break;
      case "javascript": newId = 93; break;
      default: newId = null; // No default
    }
    setId(newId);
  
    if (roomid !== "") socket.emit("update-language", { language: newLang, roomid });
  }, [roomid]);

  const SetLanguage = useMemo(() => {
    if (!language) return []; // Prevent undefined errors in CodeMirror
  
    switch (language) {
      case 'python': return [python()];
      case 'cpp': return [cpp()];
      case 'java': return [java()];
      case 'javascript': return [javascript()];
      default: return []; // Prevent errors
    }
  }, [language]);

  return (
    <div style={styles.container}>
      {/* Room ID, Language Select, and Buttons in One Line */}
      <form style={styles.form} onSubmit={joinRoom}>
        <TextField
          type="text"
          placeholder="Enter Room ID"
          value={roomid}
          inputRef={roomInputRef}
          onChange={(e) => setRoomid(e.target.value)}
          style={styles.input}
          disabled={isRoomJoined}
        />

        <Select
          value={language}
          onChange={(e) => updateLang(e.target.value)}
          style={styles.select}
          options={[
            { value: "", label: "Select your language" },
            { value: "javascript", label: "JavaScript" },
            { value: "python", label: "Python" },
            { value: "cpp", label: "C++" },
            { value: "java", label: "Java" }
          ]}
        />

        {!isRoomJoined ? (
          <Button 
            type="submit" 
            variant="contained" 
            color="success"
            style={styles.button}
          >
            Join
          </Button>
        ) : (
          <Button 
            type="button" 
            variant="contained" 
            color="error"
            onClick={(e) => { e.preventDefault(); disconnectRoom(); }} 
            style={styles.disconnectButton}
          >
            Disconnect
          </Button>
        )}
        <Button 
          type="button" 
          variant="contained" 
          color="success"
          onClick={runCode} 
          style={styles.runButton}
        >
          Run Code
        </Button>
      </form>

      {/* Code Editor */}
      <div style={styles.codeEditor}>
        <Typography variant="h4" style={styles.codeEditorTitle}>
          Code Here ⤵
        </Typography>
        <CodeMirror 
          value={code} 
          extensions={[SetLanguage]} 
          onChange={(value) => updateCode(value)} 
          style={styles.codeMirror} 
        />
      </div>
      
      {/* IO Container: Input Left, Output Right */}
      <div style={styles.ioContainer}>
        <div style={styles.inputContainer}>
          <Typography variant="h5" style={styles.ioHeader}>
            Input
          </Typography>
          <TextField
            multiline
            rows={6}
            name="inputArea"
            placeholder="Enter Input"
            value={stdInput}
            onChange={(e) => updateInput(e.target.value)}
            style={styles.ioBox}
          />
        </div>

        <div style={styles.outputContainer}>
          <Typography variant="h5" style={styles.ioHeader}>
            Output
          </Typography>
          <TextField
            multiline
            rows={6}
            name="outputArea"
            value={stdOutput}
            readOnly
            style={styles.ioBox}
          />
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    backgroundColor: colors.background.default,
    borderRadius: "8px",
  },
  form: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    justifyContent: "center",
    marginBottom: "24px",
  },
  input: {
    width: "180px",
  },
  select: {
    minWidth: "180px",
  },
  button: {
    minWidth: "100px",
  },
  disconnectButton: {
    minWidth: "100px",
  },
  runButton: {
    minWidth: "100px",
  },
  codeEditor: {
    borderRadius: "8px",
    border: `1px solid ${colors.divider}`,
    padding: "16px",
    backgroundColor: colors.background.paper,
    marginBottom: "24px",
  },
  codeEditorTitle: {
    color: colors.primary.main,
    fontWeight: 600,
    marginBottom: "16px",
  },
  codeMirror: {
    borderRadius: "4px",
    overflow: "hidden",
  },
  ioContainer: {
    display: "flex",
    justifyContent: "space-between",
    gap: "24px",
  },
  inputContainer: { 
    width: "48%" 
  },
  outputContainer: { 
    width: "48%" 
  },
  ioHeader: {
    fontWeight: 600,
    marginBottom: "12px",
    color: colors.primary.main,
  },
  ioBox: {
    width: "100%",
  },
};

export default PeerProgPage;
