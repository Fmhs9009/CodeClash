import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript'; 
import { python } from '@codemirror/lang-python'; 
import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java'; 
import socket from "./Socket"; 
import createSubmission from './CodeExecution';
import { Button, Select, Card } from './ui';

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

const CollaborativeCodeEditor = ({ roomid, joinedRoom }) => {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("");
  const [id, setId] = useState(0);
  const [stdOutput, setStdOutput] = useState("");
  const [stdInput, setStdInput] = useState("");
  const [isCodeRunning, setIsCodeRunning] = useState(false);
  const outputRef = useRef(null);

  useEffect(() => {
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

  const updateLang = useCallback((newLang) => {
    setLanguage(newLang);
    setId(newLang === 'python' ? 71 : newLang === 'cpp' ? 54 : newLang === 'java' ? 62 : 63);
    
    if (roomid !== "") socket.emit("update-language", { language: newLang, roomid });
  }, [roomid]);

  const runCode = useCallback(async () => {
    if (code.trim() === "") return;
    if (language === '') {
      alert('Please choose your language');
      return;
    }
    
    setIsCodeRunning(true);
    setStdOutput(""); // Clear previous output
    
    try {
      const result = await createSubmission(id, code, stdInput.trim() !== "" ? stdInput.trim() : "");

      if (result?.output) {
        setStdOutput(result.output);
        if (roomid !== "") socket.emit("update-output", { outputVal: result.output, roomid });
        
        // Auto-focus to output section after getting response
        setTimeout(() => {
          if (outputRef.current) {
            outputRef.current.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center' 
            });
            outputRef.current.focus();
          }
        }, 100);
      } else {
        setStdOutput("No output received.");
      }
    } catch (error) {
      console.error("Error executing code:", error);
      setStdOutput("Error executing code.");
      
      // Auto-focus even on error
      setTimeout(() => {
        if (outputRef.current) {
          outputRef.current.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
          outputRef.current.focus();
        }
      }, 100);
    } finally {
      setIsCodeRunning(false);
    }
  }, [code, id, stdInput, roomid]);

  const updateInput = useCallback((e) => {
    const inputValue = e.target.value;
    setStdInput(inputValue);
    if (roomid !== "") socket.emit("update-input", { inputValue, roomid });
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
    <Card variant="outlined" style={styles.cardWrapper}>
      <div style={styles.container}>
      {/* Code Editor Section */}
      <div style={styles.codeSection}>
        {/* Section Header */}
        <div style={styles.editorSectionHeader}>
          <h4 style={styles.editorSectionTitle}>
            💻 Collaborative Code Editor
          </h4>
        </div>
        
        {/* Editor Controls Bar */}
        <div style={styles.editorControlsBar}>
          <div style={styles.languageControlGroup}>
            <label style={styles.controlLabel}>Language:</label>
            <Select
              value={language}
              onChange={(e) => updateLang(e.target.value)}
              style={styles.languageDropdown}
              options={[
                { value: "", label: "Select Language" },
                { value: "javascript", label: "JavaScript" },
                { value: "python", label: "Python" },
                { value: "cpp", label: "C++" },
                { value: "java", label: "Java" }
              ]}
            />
            {language && (
              <div style={styles.languageIndicatorBadge}>
                {language.toUpperCase()}
              </div>
            )}
          </div>
          
          <button 
            type="button" 
            onClick={runCode} 
            disabled={isCodeRunning}
            style={{
              ...styles.runCodeButton,
              ...(isCodeRunning ? styles.runCodeButtonLoading : {})
            }}
          >
            {isCodeRunning ? (
              <>
                <span style={styles.loadingSpinner}>⏳</span>
                Running...
              </>
            ) : (
              <>🚀 Run Code</>
            )}
          </button>
        </div>
        
        {/* Code Editor */}
        <div style={styles.editorContainer}>
          <CodeMirror
            value={code}
            onChange={updateCode}
            extensions={SetLanguage}
            theme="dark"
            style={styles.codeMirror}
            basicSetup={{
              lineNumbers: true,
              foldGutter: true,
              dropCursor: false,
              allowMultipleSelections: false,
              indentOnInput: true,
              bracketMatching: true,
              closeBrackets: true,
              autocompletion: true,
              highlightSelectionMatches: false,
            }}
          />
        </div>
      </div>

      {/* Input/Output Section */}
      <div style={styles.ioSection}>
        <div style={styles.ioGrid}>
          {/* Input Panel */}
          <div style={styles.inputPanel}>
            <div style={styles.panelHeader}>
              <h5 style={styles.panelTitle}>📥 Input</h5>
            </div>
            <div style={styles.panelContent}>
              <textarea
                placeholder="Enter input for your code here..."
                value={stdInput}
                onChange={updateInput}
                style={styles.ioTextarea}
              />
            </div>
          </div>

          {/* Output Panel */}
          <div style={styles.outputPanel}>
            <div style={styles.panelHeader}>
              <h5 style={styles.panelTitle}>📤 Output</h5>
            </div>
            <div style={styles.panelContent}>
              <textarea
                ref={outputRef}
                value={isCodeRunning ? "⏳ Running code..." : stdOutput}
                placeholder="Code output will appear here..."
                readOnly
                style={{
                  ...styles.ioTextarea,
                  ...styles.readOnlyTextarea,
                  ...(isCodeRunning ? styles.loadingOutput : {})
                }}
              />
            </div>
          </div>
        </div>
      </div>
      </div>
    </Card>
  );
};

const styles = {
  cardWrapper: {
    background: `linear-gradient(135deg, ${themeColors.background.glass}, rgba(255, 255, 255, 0.05))`,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: `1px solid ${themeColors.secondary.main}25`,
    borderRadius: '20px',
    padding: '0',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
  },

  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'clamp(16px, 3vw, 32px)',
    padding: '0',
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

  editorSectionHeader: {
    padding: '20px 24px 16px',
    borderBottom: `1px solid ${themeColors.secondary.main}15`,
    background: `linear-gradient(135deg, ${themeColors.secondary.main}08, rgba(255, 255, 255, 0.02))`,
  },

  editorSectionTitle: {
    fontSize: '18px',
    fontWeight: 700,
    margin: 0,
    color: themeColors.text.primary,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },

  editorControlsBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 24px',
    background: `linear-gradient(135deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.01))`,
    borderBottom: `1px solid ${themeColors.secondary.main}10`,
  },

  languageControlGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },

  controlLabel: {
    fontSize: '14px',
    fontWeight: 600,
    color: themeColors.text.primary,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },

  languageDropdown: {
    minWidth: '140px',
    background: `linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.01))`,
    border: `1px solid ${themeColors.secondary.main}15`,
    borderRadius: '8px',
    padding: '8px 12px',
    color: themeColors.text.primary,
    fontSize: '13px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },

  languageIndicatorBadge: {
    padding: '4px 12px',
    background: `linear-gradient(135deg, ${themeColors.secondary.main}, ${themeColors.secondary.dark})`,
    color: themeColors.text.primary,
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },

  runCodeButton: {
    background: `linear-gradient(135deg, ${themeColors.primary.main}, ${themeColors.primary.dark})`,
    color: themeColors.text.primary,
    border: 'none',
    borderRadius: '12px',
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    boxShadow: `0 4px 12px ${themeColors.primary.main}30`,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: `0 6px 20px ${themeColors.primary.main}40`,
    },
  },

  runCodeButtonLoading: {
    opacity: 0.7,
    cursor: 'not-allowed',
    background: `linear-gradient(135deg, ${themeColors.primary.light}, ${themeColors.primary.main})`,
    '&:hover': {
      transform: 'none',
      boxShadow: `0 3px 8px ${themeColors.primary.main}30`,
    },
  },

  loadingSpinner: {
    animation: 'spin 1s linear infinite',
    display: 'inline-block',
  },

  editorContainer: {
    padding: '0',
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
    gap: 'clamp(12px, 2vw, 24px)',
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
    outline: 'none',
  },

  readOnlyTextarea: {
    background: `linear-gradient(135deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.01))`,
    cursor: 'default',
    opacity: 0.9,
  },

  loadingOutput: {
    fontStyle: 'italic',
    color: themeColors.primary.light,
    background: `linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(99, 102, 241, 0.02))`,
  },

  // CodeMirror Editor
  codeMirror: {
    fontSize: '14px',
    fontFamily: 'Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
    minHeight: '300px',
    height: 'auto',
  }, 
};

export default CollaborativeCodeEditor;
