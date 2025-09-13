import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from '@auth0/auth0-react';
import { Button, Card, Container, Typography, Grid } from './ui';
import { colors, shadows } from '../theme';
import CommonNavbar from './CommonNavbar';
import logo from '../assets/logo (2).jpeg';

const Mode = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth0();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={styles.pageContainer}>
      {/* Animated Background Shapes */}
      <div style={styles.backgroundShapes}>
        <div style={styles.floatingShape1}></div>
        <div style={styles.floatingShape2}></div>
        <div style={styles.floatingShape3}></div>
        <div style={styles.floatingShape4}></div>
      </div>

      <div style={styles.contentWrapper}>
        {/* Common Navbar */}
        <CommonNavbar />

        {/* Hero Section */}
        <section style={styles.heroSection}>
          <h1 style={styles.heroTitle}>Choose Your Coding Adventure</h1>
          <p style={styles.heroSubtitle}>
            Select your preferred mode and dive into the world of competitive programming and collaborative coding
          </p>
        </section>

        {/* Mode Selection Cards */}
        <section style={styles.modesSection}>
          <div style={styles.modeGrid}>
            {/* Contest Mode Card */}
            <div 
              style={{
                ...styles.modeCard,
                ...(windowWidth <= 768 ? styles.mobileCard : {})
              }}
              onClick={() => navigate("contest-mode")}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
                e.currentTarget.style.border = '1px solid rgba(99, 102, 241, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.1)';
              }}
            >
              <div style={styles.modeCardIcon}>🏆</div>
              <h3 style={styles.modeCardTitle}>Contest Mode</h3>
              <p style={styles.modeCardDesc}>
                Create custom coding challenges or participate in competitive contests. 
                Test your algorithmic skills and compete with developers worldwide.
              </p>
              <div style={styles.modeCardArrow}>→</div>
            </div>

            {/* Peer Programming Card */}
            <div 
              style={{
                ...styles.modeCard,
                ...(windowWidth <= 768 ? styles.mobileCard : {})
              }}
              onClick={() => navigate("peer-mode")}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
                e.currentTarget.style.border = '1px solid rgba(236, 72, 153, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.1)';
              }}
            >
              <div style={styles.modeCardIcon}>👥</div>
              <h3 style={styles.modeCardTitle}>Peer Programming</h3>
              <p style={styles.modeCardDesc}>
                Collaborate with peers in real-time coding sessions. Perfect for 
                pair programming, code reviews, and collaborative problem solving.
              </p>
              <div style={styles.modeCardArrow}>→</div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section style={styles.featuresSection}>
          <div style={styles.featuresCard}>
            <h3 style={styles.featuresTitle}>Platform Features</h3>
            <div style={styles.featuresGrid}>
              <div style={styles.featureItem}>
                <div style={styles.featureIcon}>⚡</div>
                <div style={styles.featureText}>Real-time Collaboration</div>
              </div>
              <div style={styles.featureItem}>
                <div style={styles.featureIcon}>🎯</div>
                <div style={styles.featureText}>Custom Contests</div>
              </div>
              <div style={styles.featureItem}>
                <div style={styles.featureIcon}>📊</div>
                <div style={styles.featureText}>Performance Analytics</div>
              </div>
              <div style={styles.featureItem}>
                <div style={styles.featureIcon}>🏅</div>
                <div style={styles.featureText}>Leaderboards</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

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

// Add CSS animations
const addAnimations = () => {
  if (document.getElementById('mode-animations')) return;
  
  const style = document.createElement('style');
  style.id = 'mode-animations';
  style.textContent = `
    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      33% { transform: translateY(-20px) rotate(120deg); }
      66% { transform: translateY(10px) rotate(240deg); }
    }
    
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 0.8; }
      50% { opacity: 1; }
    }
  `;
  document.head.appendChild(style);
};

// Call animations on component load
addAnimations();

const styles = {
  pageContainer: {
    minHeight: '100vh',
    background: `linear-gradient(135deg, ${themeColors.background.default} 0%, #16213e 100%)`,
    position: 'relative',
    overflow: 'hidden'
  },
  
  backgroundShapes: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: 1
  },
  
  floatingShape1: {
    position: 'absolute',
    top: '10%',
    left: '10%',
    width: '300px',
    height: '300px',
    background: `linear-gradient(135deg, ${themeColors.primary.main}15, ${themeColors.secondary.main}25)`,
    borderRadius: '50%',
    filter: 'blur(60px)',
    animation: 'float 8s ease-in-out infinite',
    zIndex: 1
  },
  
  floatingShape2: {
    position: 'absolute',
    top: '60%',
    right: '10%',
    width: '250px',
    height: '250px',
    background: `linear-gradient(135deg, ${themeColors.secondary.main}15, ${themeColors.primary.main}25)`,
    borderRadius: '50%',
    filter: 'blur(35px)',
    animation: 'float 10s ease-in-out infinite reverse'
  },
  
  floatingShape3: {
    position: 'absolute',
    bottom: '20%',
    left: '15%',
    width: '200px',
    height: '200px',
    background: `linear-gradient(135deg, ${themeColors.primary.main}10, ${themeColors.secondary.main}25)`,
    borderRadius: '50%',
    filter: 'blur(30px)',
    animation: 'float 12s ease-in-out infinite'
  },
  
  floatingShape4: {
    position: 'absolute',
    top: '30%',
    right: '25%',
    width: '180px',
    height: '180px',
    background: `linear-gradient(135deg, ${themeColors.secondary.main}20, ${themeColors.primary.main}15)`,
    borderRadius: '50%',
    filter: 'blur(25px)',
    animation: 'float 9s ease-in-out infinite reverse'
  },
  
  contentWrapper: {
    position: 'relative',
    zIndex: 2,
    minHeight: '100vh',
    padding: '0 20px'
  },
  

  
  heroSection: {
    textAlign: 'center',
    marginBottom: '1em',
    marginTop: '0px',
    padding: '60px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  
  heroTitle: {
    fontSize: '48px',
    fontWeight: 800,
    color: '#ffffff',
    marginBottom: '20px',
    letterSpacing: '-0.02em',
    lineHeight: 1.2,
    animation: 'fadeInUp 1s ease-out',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
  },
  
  heroSubtitle: {
    fontSize: '20px',
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: 400,
    lineHeight: 1.6,
    maxWidth: '600px',
    margin: '0 auto',
    animation: 'fadeInUp 1s ease-out 0.2s both',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    // marginBottom: '40px',
  },
  
  modesSection: {
    padding: '40px 20px',
    maxWidth: '1000px',
    margin: '0 auto',
    
  },
  
  modeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '30px',
    justifyContent: 'center'
  },
  
  modeCard: {
    background: themeColors.background.glass,
    backdropFilter: 'blur(20px)',
    border: `1px solid rgba(255, 255, 255, 0.1)`,
    borderRadius: '24px',
    padding: '40px',
    cursor: 'pointer',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
    animation: 'fadeInUp 0.8s ease-out',
    '&:hover': {
      transform: 'translateY(-12px) scale(1.02)',
      boxShadow: '0 25px 50px rgba(0, 0, 0, 0.4)',
      border: `1px solid ${themeColors.primary.main}60`,
      background: `linear-gradient(135deg, ${themeColors.background.glass}, rgba(255, 255, 255, 0.08))`
    }
  },
  
  mobileCard: {
    padding: '30px 20px'
  },
  
  modeCardIcon: {
    fontSize: '52px',
    marginBottom: '24px',
    display: 'block',
    filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  
  modeCardTitle: {
    fontSize: '24px',
    fontWeight: 700,
    color: '#ffffff',
    marginBottom: '16px',
    margin: '0 0 16px 0',
    letterSpacing: '-0.01em',
    lineHeight: 1.3,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
  },
  
  modeCardDesc: {
    fontSize: '15px',
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 1.7,
    marginBottom: '24px',
    margin: '0 0 24px 0',
    fontWeight: 400,
    letterSpacing: '0.01em',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
  },
  
  modeCardArrow: {
    fontSize: '28px',
    color: themeColors.primary.main,
    position: 'absolute',
    bottom: '30px',
    right: '30px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))',
    opacity: 0.9
  },
  
  featuresSection: {
    padding: '60px 20px',
    maxWidth: '800px',
    margin: '0 auto'
  },
  
  featuresCard: {
    background: themeColors.background.glass,
    backdropFilter: 'blur(20px)',
    border: `1px solid rgba(255, 255, 255, 0.1)`,
    borderRadius: '20px',
    padding: '40px',
    animation: 'fadeInUp 1s ease-out 0.4s both'
  },
  
  featuresTitle: {
    fontSize: '24px',
    fontWeight: 700,
    color: themeColors.text.primary,
    textAlign: 'center',
    marginBottom: '30px',
    margin: '0 0 30px 0'
  },
  
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '20px'
  },
  
  featureItem: {
    textAlign: 'center',
    padding: '20px'
  },
  
  featureIcon: {
    fontSize: '32px',
    marginBottom: '12px',
    display: 'block'
  },
  
  featureText: {
    fontSize: '14px',
    color: themeColors.text.secondary,
    fontWeight: 500
  },
  
  // Responsive styles
  '@media (max-width: 768px)': {
    heroTitle: {
      fontSize: '36px'
    },
    heroSubtitle: {
      fontSize: '16px'
    },
    modeGrid: {
      gridTemplateColumns: '1fr',
      gap: '20px'
    },
    headerContent: {
      flexDirection: 'column',
      textAlign: 'center'
    }
  }
};

export default Mode;
