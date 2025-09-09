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
      {/* Room Connection Section */}
      <div style={styles.connectionSection}>
        <div style={styles.sectionHeader}>
          <h4 style={styles.sectionTitle}>
            🌐 Room Connection
          </h4>
          {isRoomJoined && (
            <div style={styles.connectionStatus}>
              <div style={styles.statusDot}></div>
              <span style={styles.statusText}>Connected to {joinedRoom}</span>
            </div>
          )}
        </div>
        
        <form style={styles.connectionForm} onSubmit={joinRoom}>
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
          <button 
            type="button" 
            onClick={runCode} 
            style={styles.runButton}
          >
            🚀 Run Code
          </button>
        </form>
      </div>

      {/* Code Editor Section */}
      <div style={styles.codeSection}>
        <div style={styles.sectionHeader}>
          <h4 style={styles.sectionTitle}>
            💻 Code Editor
          </h4>
          <div style={styles.languageIndicator}>
            {language && (
              <span style={styles.languageTag}>
                {language.toUpperCase()}
              </span>
            )}
          </div>
        </div>
        
        <div style={styles.editorContainer}>
          <CodeMirror 
            value={code} 
            extensions={[SetLanguage]} 
            onChange={(value) => updateCode(value)} 
            style={styles.codeMirror}
            theme="dark"
            height="300px"
            basicSetup={{
              lineNumbers: true,
              foldGutter: true,
              dropCursor: false,
              allowMultipleSelections: false,
            }}
          />
        </div>
      </div>
      
      {/* IO Section */}
      <div style={styles.ioSection}>
        <div style={styles.ioGrid}>
          <div style={styles.inputPanel}>
            <div style={styles.panelHeader}>
              <h5 style={styles.panelTitle}>
                📝 Input
              </h5>
            </div>
            <div style={styles.panelContent}>
              <textarea
                placeholder="Enter your input here..."
                value={stdInput}
                onChange={(e) => updateInput(e.target.value)}
                style={styles.ioTextarea}
              />
            </div>
          </div>

          <div style={styles.outputPanel}>
            <div style={styles.panelHeader}>
              <h5 style={styles.panelTitle}>
                📊 Output
              </h5>
            </div>
            <div style={styles.panelContent}>
              <textarea
                value={stdOutput}
                readOnly
                placeholder="Output will appear here..."
                style={{
                  ...styles.ioTextarea,
                  ...styles.readOnlyTextarea
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  // Main Container
  container: {
    padding: '24px 28px 28px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    height: '100%',
  },

  // Connection Section
  connectionSection: {
    background: `linear-gradient(135deg, ${themeColors.background.glass}, rgba(255, 255, 255, 0.04))`,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: `1px solid ${themeColors.primary.main}20`,
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  },

  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '20px',
  },

  sectionTitle: {
    fontSize: '18px',
    fontWeight: 700,
    margin: 0,
    color: themeColors.text.primary,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },

  connectionStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 12px',
    background: `linear-gradient(135deg, ${themeColors.success.main}15, rgba(255, 255, 255, 0.05))`,
    borderRadius: '20px',
    border: `1px solid ${themeColors.success.main}25`,
  },

  statusDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: themeColors.success.main,
    animation: 'pulse 2s infinite',
  },

  statusText: {
    fontSize: '12px',
    fontWeight: 600,
    color: themeColors.success.light,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },

  // Connection Form
  connectionForm: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr auto auto',
    gap: '16px',
    alignItems: 'end',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
      gap: '12px',
    },
  },

  input: {
    background: `linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))`,
    border: `1px solid ${themeColors.primary.main}20`,
    borderRadius: '12px',
    padding: '12px 16px',
    color: themeColors.text.primary,
    fontSize: '14px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    '&:focus': {
      outline: 'none',
      border: `1px solid ${themeColors.primary.main}60`,
      boxShadow: `0 0 0 3px ${themeColors.primary.main}15`,
    },
    '&:disabled': {
      opacity: 0.6,
      cursor: 'not-allowed',
    },
  },

  select: {
    background: `linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))`,
    border: `1px solid ${themeColors.primary.main}20`,
    borderRadius: '12px',
    padding: '12px 16px',
    color: themeColors.text.primary,
    fontSize: '14px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    cursor: 'pointer',
  },

  button: {
    background: `linear-gradient(135deg, ${themeColors.success.main}, ${themeColors.success.dark})`,
    color: themeColors.text.primary,
    border: 'none',
    borderRadius: '12px',
    padding: '12px 20px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    boxShadow: `0 4px 12px ${themeColors.success.main}30`,
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: `0 6px 20px ${themeColors.success.main}40`,
    },
  },

  disconnectButton: {
    background: `linear-gradient(135deg, ${themeColors.error.main}, ${themeColors.error.dark})`,
    color: themeColors.text.primary,
    border: 'none',
    borderRadius: '12px',
    padding: '12px 20px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    boxShadow: `0 4px 12px ${themeColors.error.main}30`,
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: `0 6px 20px ${themeColors.error.main}40`,
    },
  },

  runButton: {
    background: `linear-gradient(135deg, ${themeColors.primary.main}, ${themeColors.primary.dark})`,
    color: themeColors.text.primary,
    border: 'none',
    borderRadius: '12px',
    padding: '12px 20px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    boxShadow: `0 4px 12px ${themeColors.primary.main}30`,
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: `0 6px 20px ${themeColors.primary.main}40`,
    },
  },

  // Code Section
  codeSection: {
    background: `linear-gradient(135deg, ${themeColors.background.glass}, rgba(255, 255, 255, 0.04))`,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: `1px solid ${themeColors.secondary.main}20`,
    borderRadius: '16px',
    padding: '0',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
  },

  languageIndicator: {
    display: 'flex',
    alignItems: 'center',
  },

  languageTag: {
    padding: '4px 12px',
    background: `linear-gradient(135deg, ${themeColors.secondary.main}, ${themeColors.secondary.dark})`,
    color: themeColors.text.primary,
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.5px',
    fontFamily: 'Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
  },

  editorContainer: {
    padding: '0 24px 24px',
  },

  codeMirror: {
    borderRadius: '12px',
    overflow: 'hidden',
    border: `1px solid ${themeColors.secondary.main}15`,
    fontSize: '14px',
    fontFamily: 'Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
    minHeight: '300px',
    height: 'auto',
  },

  // IO Section
  ioSection: {
    background: `linear-gradient(135deg, ${themeColors.background.glass}, rgba(255, 255, 255, 0.04))`,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: `1px solid ${themeColors.primary.main}20`,
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  },

  ioGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
      gap: '20px',
    },
  },

  inputPanel: {
    display: 'flex',
    flexDirection: 'column',
  },

  outputPanel: {
    display: 'flex',
    flexDirection: 'column',
  },

  panelHeader: {
    marginBottom: '12px',
    paddingBottom: '8px',
    borderBottom: `1px solid ${themeColors.primary.main}15`,
  },

  panelTitle: {
    fontSize: '16px',
    fontWeight: 600,
    margin: 0,
    color: themeColors.text.primary,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },

  panelContent: {
    flex: 1,
  },

  ioTextarea: {
    width: '100%',
    height: '160px',
    background: `linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.01))`,
    border: `1px solid ${themeColors.primary.main}15`,
    borderRadius: '12px',
    padding: '16px',
    color: themeColors.text.primary,
    fontSize: '14px',
    fontFamily: 'Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
    resize: 'vertical',
    minHeight: '120px',
    '&:focus': {
      outline: 'none',
      border: `1px solid ${themeColors.primary.main}40`,
      boxShadow: `0 0 0 3px ${themeColors.primary.main}10`,
    },
    '&::placeholder': {
      color: 'rgba(255, 255, 255, 0.4)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    },
  },

  readOnlyTextarea: {
    background: `linear-gradient(135deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.01))`,
    cursor: 'default',
    opacity: 0.9,
  },
};

export default PeerProgPage;
