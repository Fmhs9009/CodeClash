import React, { useRef } from 'react';
import { Button, TextField, Card } from './ui';

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

const RoomConnection = ({ 
  roomid, 
  setRoomid, 
  joinedRoom, 
  setJoinedRoom, 
  isRoomJoined, 
  setIsRoomJoined,
  joinRoom,
  disconnectRoom 
}) => {
  const roomInputRef = useRef("");

  return (
    <Card variant="outlined" style={styles.cardWrapper}>
      <div style={styles.container}>
        {/* Room Connection Section */}
        <div style={styles.connectionSection}>
        <div style={styles.sectionHeader}>
          <h4 style={styles.sectionTitle}>
            🔗 Room Connection
          </h4>
          {isRoomJoined && (
            <div style={styles.connectionStatus}>
              <div style={styles.statusDot}></div>
              <span style={styles.statusText}>Connected to {joinedRoom}</span>
            </div>
          )}
        </div>
        
        {/* Room Connection Form */}
        <div style={styles.roomConnectionContainer}>
          <div style={styles.roomInputGroup}>
            <TextField
              label="Room ID"
              placeholder="Enter Room ID to join collaborative session"
              value={roomid}
              inputRef={roomInputRef}
              onChange={(e) => setRoomid(e.target.value)}
              style={styles.input}
              disabled={isRoomJoined}
            />
            
            {/* Join/Disconnect Button */}
            <div style={styles.joinButtonContainer}>
              {!isRoomJoined ? (
                <Button 
                  type="button" 
                  variant="contained" 
                  onClick={joinRoom}
                  style={styles.joinButton}
                  disabled={!roomid.trim()}
                >
                  🚀 Join Room
                </Button>
              ) : (
                <Button 
                  type="button" 
                  variant="contained" 
                  onClick={disconnectRoom}
                  style={styles.disconnectButton}
                >
                  🔌 Disconnect
                </Button>
              )}
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
    border: `1px solid ${themeColors.primary.main}25`,
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

  // Room Connection Section
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
    paddingBottom: '12px',
    borderBottom: `1px solid ${themeColors.primary.main}15`,
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
    border: `1px solid ${themeColors.success.main}25`,
    borderRadius: '20px',
    backdropFilter: 'blur(10px)',
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
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },

  roomConnectionContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },

  roomInputGroup: {
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    gap: '16px',
    alignItems: 'end',
  },

  input: {
    background: `linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.01))`,
    border: `1px solid ${themeColors.primary.main}15`,
    borderRadius: '12px',
    padding: '14px 18px',
    color: themeColors.text.primary,
    fontSize: '14px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    outline: 'none',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:focus': {
      border: `1px solid ${themeColors.primary.main}40`,
      boxShadow: `0 0 0 3px ${themeColors.primary.main}15`,
    },
    '&:disabled': {
      opacity: 0.6,
      cursor: 'not-allowed',
    },
  },

  joinButtonContainer: {
    display: 'flex',
    alignItems: 'center',
  },

  joinButton: {
    background: `linear-gradient(135deg, ${themeColors.success.main}, ${themeColors.success.dark})`,
    color: themeColors.text.primary,
    border: 'none',
    borderRadius: '12px',
    padding: '14px 24px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    boxShadow: `0 4px 12px ${themeColors.success.main}30`,
    minWidth: '120px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: `0 6px 20px ${themeColors.success.main}40`,
    },
    '&:disabled': {
      opacity: 0.6,
      cursor: 'not-allowed',
      transform: 'none',
    },
  },

  disconnectButton: {
    background: `linear-gradient(135deg, ${themeColors.error.main}, ${themeColors.error.dark})`,
    color: themeColors.text.primary,
    border: 'none',
    borderRadius: '12px',
    padding: '14px 24px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    boxShadow: `0 4px 12px ${themeColors.error.main}30`,
    minWidth: '120px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: `0 6px 20px ${themeColors.error.main}40`,
    },
  },
};

export default RoomConnection;
