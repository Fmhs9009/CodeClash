import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { io } from "socket.io-client";
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript'; 
import { python } from '@codemirror/lang-python'; 
import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java'; 
import socket from "./Socket"; 
import createSubmission from './CodeExecution';


const PeerProgPage = ({ setRoomid, roomid, setJoinedRoom , joinedRoom ,stdinput}) => {
  // const socket = useMemo(() => io("http://localhost:3000/"), []);
  const [code, setCode] = useState("");
  // const [roomid, setRoomid] = useState("");
  const [language, setLanguage] = useState("javascript");
  const roomInputRef = useRef("");
  const [isRoomJoined,setIsRoomJoined] = useState(false);
  const [id,setId]=useState(0);
  const [stdOutput, setStdOutput] = useState("");
  useEffect(() => {
    socket.on("connect", () => {
      console.log(socket.id); 
    });

    socket.on("send-code", (NewCode) => {
      setCode(NewCode);
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  const updateCode = useCallback((NewCode) => {
    setCode(NewCode);
    if (roomid !== "") {
      socket.emit("update-code", { NewCode, roomid });
    }
  }, [socket, roomid]);

  const joinRoom = useCallback((e) => {
    e.preventDefault();
    if (roomid.trim() == "") return; // Prevent joining an empty room
  
    console.log("Joining room with ID:", roomid);
    socket.emit("join-room", roomid);
  
    setJoinedRoom(roomid); 
    setIsRoomJoined(true);
  
    // Keep the input field empty after joining
    roomInputRef.current.value = "";  
  }, [socket, roomid]);
  

  const disconnectRoom = useCallback(() => {
    if (joinedRoom !== "") { // Check joinedRoom instead of roomid
      console.log("Disconnecting from room:", joinedRoom);
      socket.emit("disconnect-room", joinedRoom);
  
      // Update states in the correct order
      setIsRoomJoined(false); 
      setJoinedRoom("");  // Reset the joined room
      setRoomid("");      // Reset the room ID
  
      if (roomInputRef.current) {
        roomInputRef.current.value = ""; // Reset input field
      }
    }
  }, [socket, joinedRoom, setRoomid, setJoinedRoom]);
  
  const runCode = useCallback(async () => {
    if (code.trim() === "") return;
    // console.log(stdinput);
    try {
      const result = await createSubmission(id, code, stdinput.trim() !== "" ? stdinput : null);
      
      if (result && result.output) {
        setStdOutput(result.output); 
      } else {
        setStdOutput("Error: No output received.");
      }
    } catch (error) {
      console.error("Execution error:", error);
      setStdOutput("Error executing code.");
    }
  }, [code, id, stdinput]);

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
    <>
    <div style={styles.container}>
      <form style={styles.form} onSubmit={joinRoom}>
        <input
          type="text"
          placeholder="Enter Room ID"
          value={roomid}
          ref={roomInputRef}
          onChange={(e) => setRoomid(e.target.value)}
          style={styles.input}
        />
    
        {!isRoomJoined ? (
          <button type="submit" style={styles.button}>Join Room</button>
          ) : (
          <button type="button" onClick={disconnectRoom} style={styles.disconnectButton}>Disconnect</button>
        )}
          <button type="button" onClick={runCode} style={styles.disconnectButton}>Run Code</button>
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

        <br />
    </div>
    <div>
      <section>
          <div><h2>Output</h2></div>
          <textarea name="outputArea" cols="30" value={stdOutput} readOnly></textarea>
      </section>
    </div>
    </>
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
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #E5E7EB",
    borderRadius: "4px",
    flex: 1,
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#463E7D",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  disconnectButton: {
    backgroundColor: "#FF4D4D",
    color: "#FFFFFF",
    borderRadius: "4px",
    padding: "10px 20px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  select: {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    borderRadius: "4px",
    border: "1px solid #E5E7EB",
    marginBottom: "20px",
  },
  codeEditor: {
    height: "auto",
    borderRadius: "8px",
    border: "1px solid #E5E7EB",
  },
};

export default PeerProgPage;
