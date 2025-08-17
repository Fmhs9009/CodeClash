import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { Button, Typography } from './ui';
import logoImage from '../assets/logo (2).jpeg';

const CommonNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth0();

  // Theme colors matching ContestMode.jsx
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

  const styles = {
    header: {
      padding: '20px 0',
      borderBottom: `1px solid rgba(255, 255, 255, 0.15)`,
      backdropFilter: 'blur(25px)',
      background: 'rgba(255, 255, 255, 0.08)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
    },
    
    headerContent: {
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '20px'
    },
    
    logoSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
    },
    
    headerLogo: {
      width: '50px',
      height: '50px',
      borderRadius: '12px',
      objectFit: 'cover',
    },
    
    brandTitle: {
      fontSize: '28px',
      fontWeight: 800,
      background: `linear-gradient(135deg, ${themeColors.primary.main}, ${themeColors.secondary.main})`,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      letterSpacing: '-0.02em',
    },
    
    navigation: {
      display: 'flex',
      gap: '12px',
      alignItems: 'center',
      background: 'rgba(255, 255, 255, 0.05)',
      padding: '8px',
      borderRadius: '25px',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    },
    
    navLink: {
      background: 'transparent',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      color: themeColors.text.secondary,
      padding: '10px 18px',
      borderRadius: '18px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      backdropFilter: 'blur(5px)',
    },
    
    navLinkActive: {
      background: `linear-gradient(135deg, ${themeColors.primary.main}, ${themeColors.secondary.main})`,
      color: 'white',
      border: '1px solid transparent',
      boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
      transform: 'translateY(-1px)'
    },
    
    userSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
    },
    
    userInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    
    userAvatar: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      objectFit: 'cover',
      border: `2px solid ${themeColors.primary.main}`,
    },
    
    userName: {
      color: themeColors.text.primary,
      fontWeight: 600,
      fontSize: '16px',
    },
    
    userEmail: {
      color: themeColors.text.secondary,
      fontSize: '14px',
    },
    
    logoutButton: {
      background: `linear-gradient(135deg, ${themeColors.secondary.main}, ${themeColors.secondary.dark})`,
      color: 'white',
      border: 'none',
      padding: '8px 16px',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    },
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div style={styles.header}>
      <div style={styles.headerContent}>
        <div style={styles.logoSection}>
          <img src={logoImage} alt="CodeClash" style={styles.headerLogo} />
          <Typography variant="h1" style={styles.brandTitle}>
            CodeClash
          </Typography>
        </div>
        
        {/* Navigation Links */}
        <nav style={styles.navigation}>
          <button 
            onClick={() => navigate('/mode')}
            style={{
              ...styles.navLink,
              ...(isActive('/mode') ? styles.navLinkActive : {}),
              ':hover': !isActive('/mode') ? {
                background: 'rgba(255, 255, 255, 0.15)',
                color: themeColors.text.primary,
                border: '1px solid rgba(255, 255, 255, 0.3)',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
              } : {}
            }}
          >
            Home
          </button>
          <button 
            onClick={() => navigate('/mode/contest-mode')}
            style={{
              ...styles.navLink,
              ...(isActive('/mode/contest-mode') ? styles.navLinkActive : {}),
              ':hover': !isActive('/mode/contest-mode') ? {
                background: 'rgba(255, 255, 255, 0.15)',
                color: themeColors.text.primary,
                border: '1px solid rgba(255, 255, 255, 0.3)',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
              } : {}
            }}
          >
            Contest Mode
          </button>
          <button 
            onClick={() => navigate('/mode/peer-mode')}
            style={{
              ...styles.navLink,
              ...(isActive('/mode/peer-mode') ? styles.navLinkActive : {}),
              ':hover': !isActive('/mode/peer-mode') ? {
                background: 'rgba(255, 255, 255, 0.15)',
                color: themeColors.text.primary,
                border: '1px solid rgba(255, 255, 255, 0.3)',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
              } : {}
            }}
          >
            Peer Mode
          </button>
        </nav>
        
        <div style={styles.userSection}>
          <div style={styles.userInfo}>
            <img 
              src={user?.picture} 
              alt={user?.name} 
              style={styles.userAvatar}
            />
            <div>
              <Typography variant="body1" style={styles.userName}>
                Welcome, {user?.name || 'Coder'}!
              </Typography>
              <Typography variant="body2" style={styles.userEmail}>
                {user?.email}
              </Typography>
            </div>
          </div>
          <Button
            onClick={() => logout({ returnTo: window.location.origin })}
            style={styles.logoutButton}
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CommonNavbar;
