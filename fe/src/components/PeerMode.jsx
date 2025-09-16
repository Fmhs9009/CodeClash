import React, { useEffect, useState, useCallback, useMemo, memo, useRef } from "react";
import RoomConnection from "./RoomConnection";
import CollaborativeCodeEditor from "./CollaborativeCodeEditor";
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

// Inject CSS once globally to prevent re-injection on every render
if (!document.getElementById('peer-mode-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'peer-mode-styles';
  styleSheet.textContent = `
    /* Premium Animations */
    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(180deg); }
    }
    
    @keyframes slideInMessage {
      0% { opacity: 0; transform: translateX(-20px) scale(0.9); }
      100% { opacity: 1; transform: translateX(0) scale(1); }
    }
    
    @keyframes messageGlow {
      0% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4); }
      50% { box-shadow: 0 0 20px 5px rgba(99, 102, 241, 0.2); }
      100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); }
    }
    
    @keyframes pulse {
      0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
      70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
      100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
    }
    
    @keyframes typingDot {
      0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
      30% { transform: translateY(-10px); opacity: 1; }
    }
    
    /* Typing dots animation */
    .typing-dots span {
      display: inline-block;
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: #6366f1;
      animation: typingDot 1.4s infinite;
    }
    
    .typing-dots span:nth-child(1) { animation-delay: 0s; }
    .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
    .typing-dots span:nth-child(3) { animation-delay: 0.4s; }
    
    /* Prevent white background flashes */
    body {
      background: #0f0f23 !important;
      overflow-x: hidden;
    }
    
    /* Smooth scrolling performance */
    * {
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    
    /* Custom scrollbar for chat */
    .messages-container::-webkit-scrollbar {
      width: 6px;
    }
    
    .messages-container::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 3px;
    }
    
    .messages-container::-webkit-scrollbar-thumb {
      background: rgba(99, 102, 241, 0.3);
      border-radius: 3px;
    }
    
    .messages-container::-webkit-scrollbar-thumb:hover {
      background: rgba(99, 102, 241, 0.5);
    }
  `;
  document.head.appendChild(styleSheet);
}

const PeerMode = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [roomid, setRoomid] = useState("");
  const [joinedRoom, setJoinedRoom] = useState("");
  const [isRoomJoined, setIsRoomJoined] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(1);
  const [isTyping, setIsTyping] = useState(false);
  const [lastMessageTime, setLastMessageTime] = useState(null);
  const [messageAnimation, setMessageAnimation] = useState(null);
  
  // Refs for sound and scroll
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const { user } = useAuth0();

  // Create message notification sound
  const playMessageSound = useCallback(() => {
    try {
      // Create a pleasant notification sound using Web Audio API
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Create a pleasant "ding" sound
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.log('Audio notification not supported');
    }
  }, []);

  // Auto-scroll to bottom of messages
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end'
      });
    }
  }, []);

  useEffect(() => {
    socket.on("receive-message", (data) => {
      setMessages((prevMessages) => {
        // Play sound only if message is from another user
        if (data.name !== user?.name) {
          playMessageSound();
          setMessageAnimation(data.id || Date.now());
          setTimeout(() => setMessageAnimation(null), 1000);
        }
        
        setLastMessageTime(new Date());
        setTimeout(scrollToBottom, 100);
        return [...prevMessages, data];
      });
    });

    // Listen for typing indicators
    socket.on("user-typing", (data) => {
      if (data.name !== user?.name) {
        setIsTyping(true);
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
          setIsTyping(false);
        }, 3000);
      }
    });

    // Listen for online users count
    socket.on("room-users-count", (count) => {
      setOnlineUsers(count);
    });

    return () => {
      socket.off("receive-message");
      socket.off("user-typing");
      socket.off("room-users-count");
      clearTimeout(typingTimeoutRef.current);
    };
  }, [user?.name, playMessageSound, scrollToBottom]);

  // Handle typing indicator
  const handleTyping = useCallback(() => {
    if (roomid && user?.name) {
      socket.emit("typing", {
        name: user.name,
        roomid: roomid
      });
    }
  }, [roomid, user?.name]);

  // Enhanced message input handler
  const handleMessageChange = useCallback((e) => {
    setNewMessage(e.target.value);
    handleTyping();
  }, [handleTyping]);

  // Send a new message - enhanced with better UX
  const sendMessage = useCallback(
    (e) => {
      e.preventDefault();
      if (newMessage.trim() === "") return;

      const messageData = {
        id: Date.now() + Math.random(), // Unique ID for animations
        message: newMessage.trim(),
        name: user.name,
        roomid: roomid,
        timestamp: new Date().toISOString(),
        avatar: user.picture || null
      };

      // Add message to local state immediately for better UX
      setMessages(prev => [...prev, messageData]);
      socket.emit("send-message", messageData);
      setNewMessage("");
      
      // Auto-scroll after sending
      setTimeout(scrollToBottom, 100);
    },
    [socket, newMessage, roomid, user.name]
  );

  // Room connection functions
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
  }, [roomid]);

  const disconnectRoom = useCallback(() => {
    if (!joinedRoom) return;

    console.log("Disconnecting from room:", joinedRoom);
    socket.emit("disconnect-room", joinedRoom);

    setIsRoomJoined(false);
    setJoinedRoom("");
    setRoomid("");
  }, [joinedRoom]);

  // Memoize styles to prevent recreation on every render
  const memoizedStyles = useMemo(() => styles, []);

  return (
    <div style={memoizedStyles.pageContainer}>
      {/* Animated Background Shapes */}
      <div style={memoizedStyles.backgroundShapes}>
        <div style={memoizedStyles.floatingShape1}></div>
        <div style={memoizedStyles.floatingShape2}></div>
        <div style={memoizedStyles.floatingShape3}></div>
      </div>

      {/* Premium Navbar */}
      <CommonNavbar />

      {/* Hero Section */}
      <div style={memoizedStyles.heroSection}>
        <div style={memoizedStyles.heroContent}>
          <h1 style={memoizedStyles.heroTitle}>
            🤝 Peer Programming Mode
          </h1>
          <p style={memoizedStyles.heroSubtitle}>
            Collaborate on code, debug together, and learn effectively with your peers in real-time.
          </p>
        </div>
      </div>

      <Container maxWidth="xl" style={memoizedStyles.container}>

        <div style={memoizedStyles.content}>
          {/* Section 1 - Room Connection */}
          <div style={memoizedStyles.roomConnectionSection}>
            <RoomConnection 
              roomid={roomid}
              setRoomid={setRoomid}
              joinedRoom={joinedRoom}
              setJoinedRoom={setJoinedRoom}
              isRoomJoined={isRoomJoined}
              setIsRoomJoined={setIsRoomJoined}
              joinRoom={joinRoom}
              disconnectRoom={disconnectRoom}
            />
          </div>

          {/* Section 2 - Live Chat */}
          <div style={memoizedStyles.chatSection}>
            <Card variant="outlined" style={memoizedStyles.chatCard}>
              <div style={memoizedStyles.chatHeader}>
                <div style={memoizedStyles.chatTitleContainer}>
                  <h3 style={memoizedStyles.chatTitle}>💬 Live Chat</h3>
                  <div style={memoizedStyles.onlineStatus}>
                    <div style={memoizedStyles.onlineIndicator}></div>
                    <span style={memoizedStyles.onlineText}>{onlineUsers} online</span>
                  </div>
                </div>
              </div>
              
              <div ref={chatContainerRef} style={memoizedStyles.messagesContainer}>
                {messages.map((msg, index) => {
                  const isOwnMessage = msg.name === user?.name || msg.senderUserName === user?.name;
                  const isAnimated = messageAnimation === msg.id;
                  
                  return (
                    <div 
                      key={msg.id || index} 
                      style={{
                        ...memoizedStyles.messageWrapper,
                        justifyContent: isOwnMessage ? 'flex-end' : 'flex-start'
                      }}
                    >
                      {!isOwnMessage && msg.avatar && (
                        <img 
                          src={msg.avatar} 
                          alt="Avatar" 
                          style={memoizedStyles.messageAvatar}
                        />
                      )}
                      <div 
                        style={{
                          ...memoizedStyles.messageBubble,
                          ...(isOwnMessage ? memoizedStyles.ownMessage : memoizedStyles.otherMessage),
                          ...(isAnimated ? memoizedStyles.newMessageAnimation : {})
                        }}
                      >
                        {!isOwnMessage && (
                          <div style={memoizedStyles.messageSender}>
                            {msg.senderUserName || msg.name}
                          </div>
                        )}
                        <div style={memoizedStyles.messageText}>
                          {msg.text || msg.message}
                        </div>
                        <div style={memoizedStyles.messageTime}>
                          {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'now'}
                        </div>
                      </div>
                      {isOwnMessage && msg.avatar && (
                        <img 
                          src={msg.avatar} 
                          alt="Avatar" 
                          style={memoizedStyles.messageAvatar}
                        />
                      )}
                    </div>
                  );
                })}
                
                {isTyping && (
                  <div style={memoizedStyles.typingIndicator}>
                    <div style={memoizedStyles.typingDots}>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <span style={memoizedStyles.typingText}>Someone is typing...</span>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
              
              <form onSubmit={sendMessage} style={memoizedStyles.chatForm}>
                <div style={memoizedStyles.inputContainer}>
                  <TextField
                    value={newMessage}
                    onChange={handleMessageChange}
                    placeholder="Type your message..."
                    style={memoizedStyles.messageInput}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage(e);
                      }
                    }}
                  />
                  <Button 
                    type="submit" 
                    style={memoizedStyles.sendButton}
                    disabled={!newMessage.trim()}
                  >
                    🚀
                  </Button>
                </div>
              </form>
            </Card>
          </div>

          {/* Section 3 - Collaborative Code Editor */}
          <div style={memoizedStyles.codeEditorSection}>
            <CollaborativeCodeEditor 
              roomid={roomid}
              joinedRoom={joinedRoom}
            />
          </div>

        </div>
      </Container>
    </div>
  );
};

const styles = {
  // Animated Background Shapes - moved pageContainer to end for optimization

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

  // Premium Hero Section - Lightweight
  heroSection: {
    position: 'relative',
    zIndex: 5,
    padding: 'clamp(12px, 3vw, 30px) 0 clamp(8px, 2vw, 20px)',
    textAlign: 'center',
  },

  heroContent: {
    maxWidth: 'min(700px, 90vw)',
    margin: '0 auto',
    padding: '0 clamp(12px, 2vw, 24px)',
  },

  heroTitle: {
    fontSize: 'clamp(20px, 4vw, 36px)',
    fontWeight: 800,
    letterSpacing: '-0.02em',
    lineHeight: 1.2,
    marginBottom: 'clamp(6px, 1vw, 12px)',
    color: themeColors.text.primary,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    background: `linear-gradient(135deg, ${themeColors.primary.light}, ${themeColors.secondary.light})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },

  heroSubtitle: {
    fontSize: 'clamp(12px, 2vw, 16px)',
    fontWeight: 400,
    lineHeight: 1.5,
    maxWidth: 'min(480px, 85vw)',
    margin: '0 auto clamp(10px, 2vw, 24px)',
    color: themeColors.text.secondary,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },

  // Container - Lightweight
  container: {
    position: 'relative',
    zIndex: 5,
    padding: '0 clamp(8px, 2vw, 24px) clamp(16px, 4vw, 40px)',
    maxWidth: 'min(1400px, 95vw)',
    margin: '0 auto',
  },

  // Content Layout - Lightweight
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'clamp(24px, 4vw, 40px)',
    // Responsive design handled by CSS Grid
  },

  // Section Styles - Unified for all three sections
  roomConnectionSection: {
    width: '100%',
  },

  codeEditorSection: {
    width: '100%',
  },

  sectionCard: {
    background: `linear-gradient(135deg, ${themeColors.background.glass}, rgba(255, 255, 255, 0.05))`,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: `1px solid ${themeColors.primary.main}25`,
    borderRadius: '20px',
    padding: '0',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
  },

  sectionHeader: {
    padding: '24px 32px 20px',
    borderBottom: `1px solid ${themeColors.primary.main}15`,
    background: `linear-gradient(135deg, ${themeColors.primary.main}08, rgba(255, 255, 255, 0.02))`,
  },

  sectionTitle: {
    fontSize: '20px',
    fontWeight: 700,
    margin: 0,
    color: themeColors.text.primary,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    letterSpacing: '-0.01em',
  },

  // Chat Section - Enhanced Premium Design
  chatSection: {
    width: '100%',
  },

  chatCard: {
    background: `linear-gradient(135deg, ${themeColors.background.glass}, rgba(255, 255, 255, 0.04))`,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: `1px solid ${themeColors.primary.main}20`,
    borderRadius: 'clamp(10px, 2vw, 20px)',
    padding: '0',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    height: 'clamp(400px, 50vh, 600px)',
    display: 'flex',
    flexDirection: 'column',
  },

  chatTitleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },

  onlineStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 12px',
    background: `linear-gradient(135deg, ${themeColors.success.main}15, rgba(255, 255, 255, 0.05))`,
    border: `1px solid ${themeColors.success.main}25`,
    borderRadius: '20px',
  },

  onlineIndicator: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: themeColors.success.main,
    animation: 'pulse 2s infinite',
  },

  onlineText: {
    fontSize: '12px',
    fontWeight: 600,
    color: themeColors.success.light,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },

  // Coding Section - Lightweight
  codingSection: {
    width: '100%',
  },

  codingCard: {
    background: `linear-gradient(135deg, ${themeColors.background.glass}, rgba(255, 255, 255, 0.04))`,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: `1px solid ${themeColors.secondary.main}20`,
    borderRadius: 'clamp(10px, 2vw, 20px)',
    padding: '0',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
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

  // Chat Header - Lightweight
  chatHeader: {
    padding: 'clamp(12px, 2vw, 24px) clamp(14px, 3vw, 28px) clamp(8px, 2vw, 20px)',
    borderBottom: `1px solid ${themeColors.primary.main}15`,
    background: `linear-gradient(135deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.01))`,
  },

  chatTitleContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
    // Responsive spacing handled by CSS Grid
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

  // Premium Chat Box - Responsive
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
    // Responsive design handled by CSS Grid
  },

  // Premium Message Bubbles - Optimized
  message: {
    borderRadius: '16px',
    padding: '12px 16px',
    maxWidth: '85%',
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
    willChange: 'transform, opacity',
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

  // Enhanced Message Bubble Styles
  messagesContainer: {
    flex: 1,
    padding: 'clamp(12px, 2vw, 24px)',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 'clamp(8px, 1.5vw, 16px)',
    background: `linear-gradient(135deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.01))`,
    scrollBehavior: 'smooth',
    className: 'messages-container',
  },

  messageWrapper: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '8px',
    margin: '4px 0',
    animation: 'slideInMessage 0.3s ease-out',
  },

  messageBubble: {
    maxWidth: '70%',
    padding: '12px 16px',
    borderRadius: '18px',
    position: 'relative',
    wordWrap: 'break-word',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },

  ownMessage: {
    background: `linear-gradient(135deg, ${themeColors.primary.main}, ${themeColors.primary.dark})`,
    color: '#ffffff',
    borderBottomRightRadius: '6px',
  },

  otherMessage: {
    background: `linear-gradient(135deg, ${themeColors.background.paper}, rgba(255, 255, 255, 0.1))`,
    color: themeColors.text.primary,
    border: `1px solid rgba(255, 255, 255, 0.1)`,
    borderBottomLeftRadius: '6px',
  },

  messageAvatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    border: `2px solid ${themeColors.primary.main}40`,
  },

  messageTime: {
    fontSize: '10px',
    opacity: 0.6,
    marginTop: '4px',
    textAlign: 'right',
  },

  newMessageAnimation: {
    animation: 'messageGlow 1s ease-out',
  },

  typingIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    background: `linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))`,
    borderRadius: '18px',
    border: `1px solid rgba(255, 255, 255, 0.1)`,
    maxWidth: '150px',
  },

  typingDots: {
    display: 'flex',
    gap: '3px',
    className: 'typing-dots',
  },

  typingText: {
    fontSize: '12px',
    opacity: 0.7,
    fontStyle: 'italic',
  },

  messageInput: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    outline: 'none',
    padding: '12px 16px',
    color: themeColors.text.primary,
    fontSize: '14px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    '::placeholder': {
      color: 'rgba(255, 255, 255, 0.5)',
    },
  },

  sendButton: {
    background: `linear-gradient(135deg, ${themeColors.primary.main}, ${themeColors.primary.dark})`,
    border: 'none',
    borderRadius: '12px',
    padding: '10px 16px',
    color: '#ffffff',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '50px',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: `0 4px 12px ${themeColors.primary.main}40`,
    },
    '&:disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
      transform: 'none',
    },
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


  // Enhanced page container with full background coverage
  pageContainer: {
    minHeight: '100vh',
    background: `linear-gradient(135deg, ${themeColors.background.default} 0%, #16213e 100%)`,
    position: 'relative',
    overflow: 'hidden',
    // Prevent white flashes during fast scrolling
    transform: 'translateZ(0)',
    backfaceVisibility: 'hidden',
    perspective: 1000,
  },
};

export default memo(PeerMode);
