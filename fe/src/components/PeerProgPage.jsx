import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript'; 
import { python } from '@codemirror/lang-python'; 
import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java'; 
import socket from "./Socket"; 
import createSubmission from './CodeExecution';

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
      alert('Pls enter a room id')
      return;
    }

    console.log("Joining room:", roomid);
    socket.emit("join-room", roomid);
    setJoinedRoom(roomid);
    setIsRoomJoined(true);
    roomInputRef.current.value = "";
  }, [roomid]);

  const disconnectRoom = useCallback(() => {
    
    if (!joinedRoom) return;

    console.log("Disconnecting from room:", joinedRoom);
    socket.emit("disconnect-room", joinedRoom);

    setIsRoomJoined(false);
    setJoinedRoom("");
    setRoomid("");
  }, [joinedRoom]);

  const runCode = useCallback(async () => {
    if (code.trim() === "") return;
    if (language === '') {
      alert('Pls choose ur language');
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
  }, [code, id, stdInput]);

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
        <input
          type="text"
          placeholder="Enter Room ID"
          value={roomid}
          ref={roomInputRef}
          onChange={(e) => setRoomid(e.target.value)}
          style={styles.input}
          readOnly={isRoomJoined}
        />

        <select value={language} onChange={(e) => updateLang(e.target.value)} style={styles.select}>
          <option value="">Select your language</option>
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="cpp">C++</option>
          <option value="java">Java</option>
        </select>

        {!isRoomJoined ? (
          <button type="submit" style={styles.button}>Join</button>
        ) : (
          <button type="button" onClick={(e) => { e.preventDefault(); disconnectRoom(); }} style={styles.disconnectButton}>Disconnect</button>
        )}
        <button type="button" onClick={runCode} style={styles.runButton}>Run Code</button>
      </form>

      {/* Code Editor */}
      {/* <div style={styles.codeEditor}>
        <h1>Code Here⤵</h1>
        <CodeMirror value={code} extensions={[SetLanguage]} onChange={(value) => updateCode(value)} style={styles.codeEditor} />
      </div> */}
      <div style={styles.codeEditor}>
        <h2 style={{
      color: "#463E7D",
      fontWeight: "bold",
      marginBottom: "10px",}}>Code Here⤵</h2>
        <CodeMirror value={code} extensions={[SetLanguage]} onChange={(value) => updateCode(value)} style={styles.codeEditor} />
      </div>
      

      {/* IO Container: Input Left, Output Right */}
      <div style={styles.ioContainer}>
        <div style={styles.inputContainer}>
          <h2 style={styles.ioHeader}>Input</h2>
          <textarea name="inputArea" placeholder="Enter Input" value={stdInput} onChange={(e) => updateInput(e.target.value)} style={styles.ioBox} />
        </div>

        <div style={styles.outputContainer}>
          <h2 style={styles.ioHeader}>Output</h2>
          <textarea name="outputArea" value={stdOutput} readOnly style={styles.ioBox} />
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    backgroundColor: "#F7F9FC",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  },
  form: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    justifyContent: "center",
    marginBottom: "20px",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    border: "1.5px solid #D1D5DB",
    borderRadius: "6px",
    outline: "none",
    width: "180px",
  },
  select: {
    padding: "10px",
    fontSize: "16px",
    borderRadius: "6px",
    border: "1.5px solid #D1D5DB",
    backgroundColor: "#FFF",
  },
  button: {
    padding: "10px 16px",
    backgroundColor: "#4CAF50",
    color: "#FFF",
    borderRadius: "6px",
    cursor: "pointer",
  },
  disconnectButton: {
    backgroundColor: "#FF4D4D",
    color: "#FFF",
    borderRadius: "6px",
    padding: "10px 16px",
  },
  runButton: {
    backgroundColor: "#28A745",
    color: "#FFF",
    borderRadius: "6px",
    padding: "10px 16px",
  },
  codeEditor: {
    borderRadius: "8px",
    border: "1.5px solid #D1D5DB",
    padding: "10px",
    backgroundColor: "#FFF",
  },
  ioContainer: {
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
    marginTop: "20px",
  },
  inputContainer: { width: "48%" },
  outputContainer: { width: "48%" },
  ioHeader: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "10px",
    color: "#463E7D",
  },
  ioBox: {
    width: "100%",
    minHeight: "120px",
    borderRadius: "6px",
    padding: "10px",
    fontSize: "16px",
    border: "1.5px solid #D1D5DB",
    backgroundColor: "#F9F9F9",
    resize: "none",
  },
};

export default PeerProgPage;
