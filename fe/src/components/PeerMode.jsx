import React, { useEffect, useState, useCallback, useMemo } from "react";
import PeerProgPage from "./PeerProgPage";
import { io } from "socket.io-client";
import socket from "./Socket";
import { useAuth0 } from '@auth0/auth0-react';


const PeerMode = () => {
  // const socket = useMemo(() => io("http://localhost:3000/"), []);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [roomid, setRoomid] = useState("");
  const [joinedRoom,setJoinedRoom] = useState("");



  const {user}=useAuth0();
  // Listen for incoming messages
  useEffect(() => {
    socket.on("receive-message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("receive-message");
    };
  }, [socket]);
  

  // Send a new message
  const sendMessage = useCallback(
    (e) => {
      e.preventDefault();
      console.log("Send button clicked");
      console.log("New message:", newMessage);
      console.log("Room ID:", roomid);
  
      if (newMessage.trim() && roomid) {
        const message = { text: newMessage };
        const senderUserName=user.name;
        console.log("Sending message:", { message, roomid , senderUserName}); // Log message details
        console.log("senderUserName:",user.name);
       
        socket.emit("send-message", { message, roomid ,senderUserName });
        setMessages((prevMessages) => [
          ...prevMessages,
          { ...message, sender: socket.id,senderUserName },
        ]);
        setNewMessage(""); // This should clear the input
        console.log("Message sent and input cleared");
      } else {
        console.log("Message or Room ID is invalid");
      }
    },
    [socket, newMessage, roomid]
  );
  
 
  

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Peer Programming Mode</h1>
        <p style={styles.subtitle}>
          Collaborate on code, debug together, and learn effectively with your peers.
        </p>
      </header>

      <main style={styles.content}>
        <section style={styles.chatSection}>
          <div style={styles.chatHeadingDiv}>
            <h2 style={styles.chatTitle}>Chat</h2>
            {joinedRoom && (
              <div style={styles.roomInfo}>
                <h2 style={styles.roomTitle}>Joined Room:</h2>
                <p style={styles.roomId}>{joinedRoom}</p>
              </div>
            )}
          </div>
          <div style={styles.chatBox}>
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  ...styles.message,
                  alignSelf: msg.sender === socket.id ? "flex-end" : "flex-start",
                }}
              >
                <span style={{color:"black", fontWeight:"bolder"}}>{msg.senderUserName || "Unknown User"}</span>
<br />
                {msg.text}
              </div>
            ))}
          </div>
          <form style={styles.chatForm} onSubmit={sendMessage}>
            <input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              style={styles.chatInput}
            />
            <button type="submit" style={styles.chatButton}>
              Send
            </button>
          </form>
        </section>
            
        <section style={styles.actionSection}>
          <PeerProgPage setRoomid={setRoomid} roomid={roomid} setJoinedRoom={setJoinedRoom} joinedRoom={joinedRoom} />
        </section>

      </main>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "'Roboto', sans-serif",
    backgroundColor: "#F7F9FC",
    padding: "20px",
    borderRadius: "8px",
    maxWidth: "1200px",
    margin: "20px auto",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  },
  header: {
    textAlign: "center",
    marginBottom: "30px",
  },
  title: {
    fontSize: "36px",
    color: "#463E7D",
    marginBottom: "10px",
  },
  subtitle: {
    fontSize: "18px",
    color: "#6B7280",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  chatHeadingDiv: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%", 
  },
  chatSection: {
    height:'200px',
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: "8px",
    padding: "20px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    marginBottom: "20px",
  },
  chatTitle: {
    fontSize: "1.7vw",
    color: "#463E7D",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  chatBox: {
    height: "200px",
    overflowY: "scroll",
    marginBottom: "10px",
    padding: "10px",
    border: "1px solid #E5E7EB",
    borderRadius: "8px",
    backgroundColor: "#F9FAFB",
  },
  message: {
    backgroundColor: "#E5E7EB",
    borderRadius: "8px",
    padding: "8px 12px",
    margin: "5px 0",
    maxWidth: "0%",        // Max width won't exceed 70% of the parent container
    minWidth: "fit-content", // Min width will adjust based on content
    wordWrap: "break-word",  // Ensure wrapping of long words
    whiteSpace: "normal",    // Allow text to wrap naturally
    overflowWrap: "break-word", // Ensure overflowed text breaks into the next line
  },  
  
  chatForm: {
    display: "flex",
    gap: "10px",
  },
  chatInput: {
    flex: 1,
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #E5E7EB",
  },
  chatButton: {
    backgroundColor: "#463E7D",
    color: "#FFFFFF",
    borderRadius: "4px",
    padding: "10px 20px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  actionSection: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: "8px",
    padding: "20px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  },
  roomInfo: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "2%", 
    width: "100%", 
    marginBottom: "10px",
  },
  roomTitle: {
    fontWeight: "bold",
    color: "#463E7D",
    margin: "0",
    fontSize: "1.7vw", 
  },
  roomId: {
    fontSize: "1.7vw", 
    color: "#6B7280",
    margin: "0",
  },
  
};

export default PeerMode;
