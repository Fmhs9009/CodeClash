import React, { useEffect, useState, useCallback, useMemo } from "react";
import PeerProgPage from "./PeerProgPage";
import { io } from "socket.io-client";
import socket from "./Socket";
import { useAuth0 } from '@auth0/auth0-react';
import { Container, Typography, Button, Card, TextField } from './ui';
import { colors, shadows } from '../theme';
import CommonNavbar from './CommonNavbar';

// Premium Theme Colors
const themeColors = {
  primary: {
    main: '#6366f1',
    light: '#818cf8',
    dark: '#4f46e5'
  },
  secondary: {
    main: '#ec4899',
    light: '#f472b6',
    dark: '#db2777'
  },
  success: {
    main: '#10b981',
    light: '#34d399',
    dark: '#059669'
  },
  error: {
    main: '#ef4444',
    light: '#f87171',
    dark: '#dc2626'
  },
  background: {
    default: '#0f0f23',
    paper: '#1a1a2e',
    glass: 'rgba(255, 255, 255, 0.1)'
  },
  text: {
    primary: '#ffffff',
    secondary: '#a1a1aa'
  }
};

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
    <div style={styles.pageContainer}>
      {/* Animated Background Shapes */}
      <div style={styles.backgroundShapes}>
        <div style={styles.floatingShape1}></div>
        <div style={styles.floatingShape2}></div>
        <div style={styles.floatingShape3}></div>
      </div>

      {/* Premium Navbar */}
      <CommonNavbar />

      {/* Hero Section */}
      <div style={styles.heroSection}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>
            🤝 Peer Programming Mode
          </h1>
          <p style={styles.heroSubtitle}>
            Collaborate on code, debug together, and learn effectively with your peers in real-time.
          </p>
        </div>
      </div>

      <Container maxWidth="xl" style={styles.container}>

        <div style={styles.content}>
          {/* Top Section - Chat Interface */}
          <div style={styles.chatSection}>
            <Card variant="outlined" style={styles.chatCard}>
              <div style={styles.chatHeader}>
                <div style={styles.chatTitleContainer}>
                  <h3 style={styles.chatTitle}>
                    💬 Live Chat
                  </h3>
                  <div style={{
                    ...styles.onlineIndicator,
                    background: joinedRoom 
                      ? `linear-gradient(135deg, ${themeColors.success.main}15, rgba(255, 255, 255, 0.05))`
                      : `linear-gradient(135deg, ${themeColors.error.main}15, rgba(255, 255, 255, 0.05))`,
                    border: joinedRoom
                      ? `1px solid ${themeColors.success.main}25`
                      : `1px solid ${themeColors.error.main}25`,
                  }}>
                    <div style={{
                      ...styles.onlineDot,
                      background: joinedRoom ? themeColors.success.main : themeColors.error.main,
                      animation: joinedRoom ? 'pulse 2s infinite' : 'none',
                    }}></div>
                    <span style={{
                      ...styles.onlineText,
                      color: joinedRoom ? themeColors.success.light : themeColors.error.light,
                    }}>
                      {joinedRoom ? 'Online' : 'Offline - Join a room first'}
                    </span>
                  </div>
                </div>
                {joinedRoom && (
                  <div style={styles.roomInfo}>
                    <span style={styles.roomLabel}>Room:</span>
                    <span style={styles.roomId}>{joinedRoom}</span>
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
                      background: msg.sender === socket.id 
                        ? `linear-gradient(135deg, ${themeColors.primary.main}, ${themeColors.primary.dark})`
                        : `linear-gradient(135deg, ${themeColors.background.paper}, rgba(255, 255, 255, 0.08))`,
                      color: themeColors.text.primary,
                      border: msg.sender === socket.id 
                        ? `1px solid ${themeColors.primary.light}40`
                        : `1px solid rgba(255, 255, 255, 0.15)`,
                      boxShadow: msg.sender === socket.id
                        ? `0 4px 15px ${themeColors.primary.main}25`
                        : '0 4px 15px rgba(0, 0, 0, 0.15)',
                    }}
                  >
                    <div 
                      style={{
                        ...styles.messageSender,
                        background: msg.sender === socket.id 
                          ? `linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))`
                          : `linear-gradient(135deg, ${themeColors.secondary.main}40, ${themeColors.secondary.dark}30)`,
                        color: msg.sender === socket.id 
                          ? 'rgba(255, 255, 255, 0.95)'
                          : themeColors.secondary.light,
                        border: msg.sender === socket.id
                          ? '1px solid rgba(255, 255, 255, 0.3)'
                          : `1px solid ${themeColors.secondary.main}50`,
                      }}
                    >
                      {msg.sender === socket.id ? '👤 You' : `👥 ${msg.senderUserName || "Unknown User"}`}
                    </div>
                    <div style={styles.messageText}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
              
              <form style={styles.chatForm} onSubmit={sendMessage}>
                <div style={styles.inputContainer}>
                  <input
                    type="text"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    style={styles.chatInput}
                  />
                  <button 
                    type="submit" 
                    style={styles.sendButton}
                  >
                    🚀
                  </button>
                </div>
              </form>
            </Card>
          </div>

          {/* Bottom Section - Coding Area with Controls */}
          <div style={styles.codingSection}>
            <Card variant="outlined" style={styles.codingCard}>
              <div style={styles.codingHeader}>
                <h3 style={styles.codingTitle}>
                  💻 Collaborative Coding
                </h3>
              </div>
              
              <PeerProgPage 
                setRoomid={setRoomid} 
                roomid={roomid} 
                setJoinedRoom={setJoinedRoom} 
                joinedRoom={joinedRoom} 
              />
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
};

const styles = {
  // Premium Page Container
  pageContainer: {
    minHeight: '100vh',
    background: `linear-gradient(135deg, ${themeColors.background.default}, #16213e)`,
    position: 'relative',
    overflow: 'hidden',
  },

  // Animated Background Shapes
  backgroundShapes: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
    zIndex: 0,
  },

  floatingShape1: {
    position: 'absolute',
    top: '10%',
    left: '5%',
    width: '250px',
    height: '250px',
    background: `linear-gradient(135deg, ${themeColors.primary.main}08, ${themeColors.secondary.main}05)`,
    borderRadius: '50%',
    filter: 'blur(50px)',
    animation: 'float 8s ease-in-out infinite',
  },

  floatingShape2: {
    position: 'absolute',
    top: '60%',
    right: '8%',
    width: '180px',
    height: '180px',
    background: `linear-gradient(135deg, ${themeColors.secondary.main}10, ${themeColors.primary.main}06)`,
    borderRadius: '50%',
    filter: 'blur(40px)',
    animation: 'float 12s ease-in-out infinite reverse',
  },

  floatingShape3: {
    position: 'absolute',
    bottom: '15%',
    left: '25%',
    width: '120px',
    height: '120px',
    background: `linear-gradient(135deg, ${themeColors.primary.light}12, ${themeColors.secondary.light}08)`,
    borderRadius: '50%',
    filter: 'blur(30px)',
    animation: 'float 10s ease-in-out infinite',
  },

  // Premium Hero Section
  heroSection: {
    position: 'relative',
    zIndex: 5,
    padding: '60px 0',
    textAlign: 'center',
  },

  heroContent: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '0 24px',
  },

  heroTitle: {
    fontSize: 48,
    fontWeight: 800,
    letterSpacing: '-0.02em',
    lineHeight: 1.1,
    marginBottom: '20px',
    color: themeColors.text.primary,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    background: `linear-gradient(135deg, ${themeColors.primary.light}, ${themeColors.secondary.light})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },

  heroSubtitle: {
    fontSize: 18,
    fontWeight: 400,
    lineHeight: 1.6,
    maxWidth: '580px',
    margin: '0 auto 60px',
    color: themeColors.text.secondary,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },

  // Container
  container: {
    position: 'relative',
    zIndex: 5,
    padding: '0 24px 80px',
    maxWidth: '1400px',
    margin: '0 auto',
  },

  // Content Layout - Vertical Stack
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
  },

  // Chat Section (Top)
  chatSection: {
    width: '100%',
  },

  chatCard: {
    background: `linear-gradient(135deg, ${themeColors.background.glass}, rgba(255, 255, 255, 0.04))`,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: `1px solid ${themeColors.primary.main}20`,
    borderRadius: '20px',
    padding: '0',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)',
    overflow: 'hidden',
    height: '450px',
    display: 'flex',
    flexDirection: 'column',
  },

  // Coding Section (Bottom)
  codingSection: {
    width: '100%',
  },

  codingCard: {
    background: `linear-gradient(135deg, ${themeColors.background.glass}, rgba(255, 255, 255, 0.04))`,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: `1px solid ${themeColors.secondary.main}20`,
    borderRadius: '20px',
    padding: '0',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)',
    overflow: 'hidden',
  },

  codingHeader: {
    padding: '24px 28px 20px',
    borderBottom: `1px solid ${themeColors.secondary.main}15`,
    background: `linear-gradient(135deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.01))`,
  },

  codingTitle: {
    fontSize: '20px',
    fontWeight: 700,
    margin: 0,
    color: themeColors.text.primary,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },

  // Chat Header
  chatHeader: {
    padding: '24px 28px 20px',
    borderBottom: `1px solid ${themeColors.primary.main}15`,
    background: `linear-gradient(135deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.01))`,
  },

  chatTitleContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
  },

  chatTitle: {
    fontSize: '20px',
    fontWeight: 700,
    margin: 0,
    color: themeColors.text.primary,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },

  // Online Indicator
  onlineIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 12px',
    background: `linear-gradient(135deg, ${themeColors.primary.main}15, rgba(255, 255, 255, 0.05))`,
    borderRadius: '20px',
    border: `1px solid ${themeColors.primary.main}25`,
  },

  onlineDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#10b981',
    animation: 'pulse 2s infinite',
  },

  onlineText: {
    fontSize: '12px',
    fontWeight: 600,
    color: themeColors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },

  // Room Info
  roomInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    background: `linear-gradient(135deg, ${themeColors.secondary.main}12, rgba(255, 255, 255, 0.03))`,
    borderRadius: '12px',
    border: `1px solid ${themeColors.secondary.main}20`,
  },

  roomLabel: {
    fontSize: '12px',
    fontWeight: 600,
    color: themeColors.secondary.light,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },

  roomId: {
    fontSize: '14px',
    fontWeight: 700,
    color: themeColors.text.primary,
    fontFamily: 'Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
    background: `linear-gradient(135deg, ${themeColors.secondary.main}, ${themeColors.secondary.dark})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },

  // Premium Chat Box
  chatBox: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px 28px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    scrollbarWidth: 'thin',
    scrollbarColor: `${themeColors.primary.main}40 transparent`,
    background: `linear-gradient(135deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.05))`,
    borderRadius: '0 0 20px 20px',
  },

  // Premium Message Bubbles
  message: {
    borderRadius: '16px',
    padding: '12px 16px',
    maxWidth: '75%',
    wordWrap: 'break-word',
    whiteSpace: 'normal',
    overflowWrap: 'break-word',
    position: 'relative',
    animation: 'messageSlideIn 0.3s ease-out',
    fontSize: '14px',
    lineHeight: 1.5,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
  },

  messageSender: {
    fontWeight: 800,
    fontSize: '10px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '8px',
    padding: '4px 10px',
    borderRadius: '12px',
    display: 'inline-block',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    textShadow: '0 1px 3px rgba(0, 0, 0, 0.4)',
    backdropFilter: 'blur(5px)',
    WebkitBackdropFilter: 'blur(5px)',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
  },

  messageText: {
    fontSize: '14px',
    lineHeight: 1.5,
    color: themeColors.text.primary,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    wordWrap: 'break-word',
    whiteSpace: 'pre-wrap',
  },

  // Chat Form
  chatForm: {
    padding: '20px 28px 24px',
    borderTop: `1px solid ${themeColors.primary.main}10`,
    background: `linear-gradient(135deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.01))`,
  },

  inputContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: `linear-gradient(135deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.03))`,
    borderRadius: '16px',
    padding: '4px',
    border: `1px solid ${themeColors.primary.main}20`,
    transition: 'all 0.3s ease',
  },

  chatInput: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    outline: 'none',
    padding: '12px 16px',
    color: themeColors.text.primary,
    fontSize: '15px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    '::placeholder': {
      color: 'rgba(255, 255, 255, 0.4)',
    },
  },

  sendButton: {
    background: `linear-gradient(135deg, ${themeColors.primary.main}, ${themeColors.primary.dark})`,
    border: 'none',
    borderRadius: '12px',
    width: '44px',
    height: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '18px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: `0 4px 12px ${themeColors.primary.main}30`,
    '&:hover': {
      transform: 'translateY(-2px) scale(1.05)',
      boxShadow: `0 6px 20px ${themeColors.primary.main}40`,
    },
    '&:active': {
      transform: 'translateY(0) scale(0.98)',
    },
  },


};

// Add CSS animations
const styleSheet = document.createElement('style');
styleSheet.type = 'text/css';
styleSheet.innerText = `
  @keyframes float {
    0% {
      transform: translateY(0px) rotate(0deg);
    }
    33% {
      transform: translateY(-30px) rotate(120deg);
    }
    66% {
      transform: translateY(15px) rotate(240deg);
    }
    100% {
      transform: translateY(0px) rotate(360deg);
    }
  }
  
  @keyframes messageSlideIn {
    0% {
      opacity: 0;
      transform: translateY(20px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(16, 185, 129, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
    }
  }
`;
document.head.appendChild(styleSheet);

export default PeerMode;
