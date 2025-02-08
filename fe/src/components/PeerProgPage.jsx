import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript'; 
import { python } from '@codemirror/lang-python'; 
import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java'; 
import socket from "./Socket"; 
import createSubmission from './CodeExecution';

const PeerProgPage = ({ setRoomid, roomid, setJoinedRoom, joinedRoom}) => {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const roomInputRef = useRef("");
  const [isRoomJoined, setIsRoomJoined] = useState(false);
  const [id, setId] = useState(0);
  const [stdOutput, setStdOutput] = useState("");
  const [stdinput,setStdinput] = useState("");

  useEffect(() => {
    socket.on("connect", () => {
      console.log(socket.id); 
    });

    socket.on("send-code", (NewCode) => {
      setCode(NewCode);
    });

    socket.on("send-input", (inputValue) => {
      setStdinput(inputValue);
    });

    socket.on("send-output", (outputVal) => {
      setStdOutput(outputVal);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const updateCode = useCallback((NewCode) => {
    setCode(NewCode);
    if (roomid !== "") {
      socket.emit("update-code", { NewCode, roomid });
    }
  }, [roomid]);

  const joinRoom = useCallback((e) => {
    e.preventDefault();
    if (roomid.trim() === "") return; 

    console.log("Joining room with ID:", roomid);
    socket.emit("join-room", roomid);

    setJoinedRoom(roomid); 
    setIsRoomJoined(true);
    roomInputRef.current.value = "";  
  }, [roomid]);

  const disconnectRoom = useCallback(() => {
    if (joinedRoom !== "") { 
      console.log("Disconnecting from room:", joinedRoom);
      socket.emit("disconnect-room", joinedRoom);

      setIsRoomJoined(false); 
      setJoinedRoom("");  
      setRoomid("");      

      if (roomInputRef.current) {
        roomInputRef.current.value = ""; 
      }
    }
  }, [joinedRoom]);

  const runCode = useCallback(async () => {
    if (code.trim() === "") return;

    try {
      const result = await createSubmission(id, code, stdinput.trim() !== "" ? stdinput : null);
      
      if (result && result.output) {
        setStdOutput(result.output);

        if (roomid !== "") socket.emit("update-output",{outputVal:result.output,roomid}); 
      } 
      // else {
      //   setStdOutput("Error: No output received.");
      // }
    } catch (error) {
      console.error("Execution error:", error);
      setStdOutput("Error executing code.");
    }
  }, [code, id, stdinput]);

  const updateInput = useCallback((inputValue) => {
    setStdinput(inputValue);
    if (roomid !== "") {
      socket.emit("update-input", { inputValue, roomid });
    }
  }, [roomid]);

  const SetLanguage = useMemo(() => {
    if (language === 'python') {
      setId(92);
      return python();
    } else if (language === 'cpp') {
      setId(54);
      return cpp();
    } else if (language === 'java') { 
      setId(91);
      return java();
    } else {
      setId(93);
      return javascript();
    }
    
  }, [language]);

  return (
    <div style={styles.container}>
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
    
        {!isRoomJoined ? (
          <button type="submit" style={styles.button}>Join Room</button>
          ) : (
          <button type="button" onClick={disconnectRoom} style={styles.disconnectButton}>Disconnect</button>
        )}
        <button type="button" onClick={runCode} style={styles.runButton}>Run Code</button>
      </form>

      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        style={styles.select}
      >
        <option value="javascript">JavaScript</option>
        <option value="python">Python</option>
        <option value="cpp">C++</option>
        <option value="java">Java</option>
      </select>

      <CodeMirror
        value={code}
        extensions={[SetLanguage]}
        onChange={(value) => updateCode(value)}
        style={styles.codeEditor}
      />

      <div>
        <div>
          <h2>Input</h2>
        </div>              
        <textarea name='inputArea'  cols="30" placeholder="Enter Input Text here" value={stdinput} onChange={(e) => updateInput(e.target.value)}/>
      </div>
        
      <div style={styles.outputContainer}>
        <h2 style={styles.outputHeader}>Output</h2>
        <textarea name="outputArea" value={stdOutput} readOnly style={styles.outputArea}></textarea>
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
    overflow: "auto",
  },
  form: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "20px",
    justifyContent: "center",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    border: "2px solid #463E7D",
    borderRadius: "6px",
    outline: "none",
    transition: "0.3s",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#463E7D",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "0.3s",
  },
  disconnectButton: {
    backgroundColor: "#FF4D4D",
    color: "#FFFFFF",
    borderRadius: "6px",
    padding: "10px 20px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "0.3s",
  },
  runButton: {
    backgroundColor: "#28A745",
    color: "#FFFFFF",
    borderRadius: "6px",
    padding: "10px 20px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "0.3s",
  },
  select: {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    borderRadius: "6px",
    border: "2px solid #463E7D",
    backgroundColor: "#FFF",
    marginBottom: "20px",
  },
  codeEditor: {
    height: "auto",
    borderRadius: "8px",
    border: "2px solid #463E7D",
    padding: "10px",
    backgroundColor: "#FFF",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  },
  outputContainer: {
    marginTop: "20px",
    padding: "15px",
    backgroundColor: "#FFFFFF",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    border: "2px solid #463E7D",
  },
  outputHeader: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "10px",
    color: "#463E7D",
  },
  outputArea: {
    width: "100%",
    minHeight: "100px",
    borderRadius: "6px",
    padding: "10px",
    fontSize: "16px",
    border: "2px solid #463E7D",
    backgroundColor: "#F5F5F5",
    color: "#333",
    resize: "none",
  },
};

export default PeerProgPage;
