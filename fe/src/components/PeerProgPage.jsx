import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { io } from "socket.io-client";
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript'; 
import { python } from '@codemirror/lang-python'; 
import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java'; 
import socket from "./Socket";



const PeerProgPage = ({ setRoomid, roomid }) => {
  // const socket = useMemo(() => io("http://localhost:3000/"), []);
  const [code, setCode] = useState("");
  // const [roomid, setRoomid] = useState("");
  const [language, setLanguage] = useState("javascript");

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
    console.log("Joining room with ID:",roomid)
    socket.emit("join-room", roomid);
    console.log("Joined room", roomid);
  }, [socket, roomid]);

  const disconnectRoom = useCallback(() => {
    if (roomid !== "") {
      socket.emit("disconnect-room", roomid);
      setRoomid(""); 
    }
  }, [socket, roomid]);

  const SetLanguage = useMemo(() => {
    if (language === 'python') {
      return python();
    } else if (language === 'cpp') {
      return cpp();
    } else if (language === 'java') { 
      return java();
    } else {
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
          onChange={(e) => setRoomid(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Join Room</button>
        <button onClick={disconnectRoom} style={styles.disconnectButton}>Disconnect</button>
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
