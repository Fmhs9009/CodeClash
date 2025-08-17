import React, { useEffect, useState, useCallback, useMemo } from "react";
import PeerProgPage from "./PeerProgPage";
import { io } from "socket.io-client";
import socket from "./Socket";
import { useAuth0 } from '@auth0/auth0-react';
import { Container, Typography, Button, Card, TextField } from './ui';
import { colors, shadows } from '../theme';

const PeerMode = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [roomid, setRoomid] = useState("");
  const [joinedRoom, setJoinedRoom] = useState("");

  const { user } = useAuth0();

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
        const senderUserName = user.name;
        console.log("Sending message:", { message, roomid, senderUserName }); 
        console.log("senderUserName:", user.name);
       
        socket.emit("send-message", { message, roomid, senderUserName });
        setMessages((prevMessages) => [
          ...prevMessages,
          { ...message, sender: socket.id, senderUserName },
        ]);
        setNewMessage(""); 
        console.log("Message sent and input cleared");
      } else {
        console.log("Message or Room ID is invalid");
      }
    },
    [socket, newMessage, roomid, user]
  );

  return (
    <Container maxWidth="lg" style={styles.container}>
      <div style={styles.header}>
        <Typography variant="h2" style={styles.title}>
          Peer Programming Mode
        </Typography>
        <Typography variant="body1" style={styles.subtitle}>
          Collaborate on code, debug together, and learn effectively with your peers.
        </Typography>
      </div>

      <div style={styles.content}>
        <Card variant="outlined" style={styles.chatSection}>
          <div style={styles.chatHeadingDiv}>
            <Typography variant="h4" style={styles.chatTitle}>
              Chat
            </Typography>
            {joinedRoom && (
              <div style={styles.roomInfo}>
                <Typography variant="h4" style={styles.roomTitle}>
                  Joined Room:
                </Typography>
                <Typography variant="h4" style={styles.roomId}>
                  {joinedRoom}
                </Typography>
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
                  backgroundColor: msg.sender === socket.id ? colors.primary.light : colors.background.paper,
                  color: msg.sender === socket.id ? colors.background.paper : colors.text.primary,
                }}
              >
                <Typography variant="subtitle2" style={styles.messageSender}>
                  {msg.senderUserName || "Unknown User"}
                </Typography>
                <Typography variant="body2">
                  {msg.text}
                </Typography>
              </div>
            ))}
          </div>
          <form style={styles.chatForm} onSubmit={sendMessage}>
            <TextField
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              style={styles.chatInput}
            />
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              style={styles.chatButton}
            >
              Send
            </Button>
          </form>
        </Card>
            
        <Card variant="outlined" style={styles.actionSection}>
          <PeerProgPage 
            setRoomid={setRoomid} 
            roomid={roomid} 
            setJoinedRoom={setJoinedRoom} 
            joinedRoom={joinedRoom} 
          />
        </Card>
      </div>
    </Container>
  );
};

const styles = {
  container: {
    padding: "20px",
    marginBottom: "40px",
  },
  header: {
    textAlign: "center",
    marginBottom: "30px",
  },
  title: {
    color: colors.primary.main,
    marginBottom: "10px",
    fontWeight: 700,
  },
  subtitle: {
    color: colors.text.secondary,
    fontSize: "18px",
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
    marginBottom: "16px",
  },
  chatSection: {
    padding: "24px",
    borderRadius: "12px",
    boxShadow: shadows.medium,
    backgroundColor: colors.background.default,
    marginBottom: "20px",
  },
  chatTitle: {
    color: colors.primary.main,
    fontWeight: 600,
  },
  chatBox: {
    height: "300px",
    overflowY: "auto",
    marginBottom: "16px",
    padding: "16px",
    border: `1px solid ${colors.divider}`,
    borderRadius: "8px",
    backgroundColor: colors.background.paper,
    display: "flex",
    flexDirection: "column",
  },
  message: {
    borderRadius: "12px",
    padding: "12px 16px",
    margin: "5px 0",
    maxWidth: "70%",
    minWidth: "fit-content",
    wordWrap: "break-word",
    whiteSpace: "normal",
    overflowWrap: "break-word",
    boxShadow: shadows.small,
  },  
  messageSender: {
    fontWeight: 700,
    marginBottom: "4px",
  },
  chatForm: {
    display: "flex",
    gap: "12px",
  },
  chatInput: {
    flex: 1,
  },
  chatButton: {
    minWidth: "100px",
  },
  actionSection: {
    padding: "24px",
    borderRadius: "12px",
    boxShadow: shadows.medium,
    backgroundColor: colors.background.default,
  },
  roomInfo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  roomTitle: {
    fontWeight: 600,
    color: colors.primary.main,
    margin: 0,
    fontSize: "1.2rem",
  },
  roomId: {
    color: colors.text.secondary,
    margin: 0,
    fontSize: "1.2rem",
  },
};

export default PeerMode;
