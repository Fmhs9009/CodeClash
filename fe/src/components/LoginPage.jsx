import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Typography, Card } from './ui';
import { colors, shadows } from '../theme';
import logoImage from '../assets/logo (2).jpeg';

// Add CSS animations
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes float {
    0%, 100% {
      transform: translateY(0px) rotate(0deg);
    }
    50% {
      transform: translateY(-20px) rotate(5deg);
    }
  }
  
  @keyframes pulse {
    0%, 100% {
      opacity: 0.8;
    }
    50% {
      opacity: 1;
    }
  }
  
  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-50px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(50px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
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
`;
document.head.appendChild(styleSheet);

const LoginPage = () => {
  const { user, loginWithRedirect, isAuthenticated, logout } = useAuth0();
  const navigate = useNavigate();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredLink, setHoveredLink] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/mode'); // Redirect to /mode after login
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (isAuthenticated) {
    return (
      <div style={styles.containerLoggedIn}>
        <Card variant="elevated" style={styles.loggedInCard}>
          <Typography variant="h4" style={styles.welcomeMessage}>
            Welcome back, {user.name}!
          </Typography>
          <Button 
            variant="contained" 
            color="error" 
            onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
            style={styles.logoutButtonSmall}
          >
            Logout
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Animated Background */}
      <div style={styles.backgroundOverlay}>
        <div style={styles.floatingShape1}></div>
        <div style={styles.floatingShape2}></div>
        <div style={styles.floatingShape3}></div>
      </div>

      {/* Main Content */}
      <div style={styles.contentWrapper}>
        {/* Left Side - Branding */}
        <div style={{
          ...styles.leftSection,
          display: windowWidth <= 1024 ? 'none' : 'flex'
        }}>
          <div style={styles.brandingCard}>
            <div style={styles.brandingContent}>
              <div style={styles.logoTitleContainer}>
                <img 
                  src={logoImage} 
                  alt="CodeClash Logo" 
                  style={styles.logo}
                />
                <Typography variant="h1" style={styles.brandTitle}>
                  CodeClash
                </Typography>
              </div>
              <Typography variant="h3" style={styles.brandTagline}>
                Competitive Coding Platform
              </Typography>
              
              <div style={styles.featuresGrid}>
                <div style={styles.featureCard}>
                  <div style={styles.featureHeader}>
                    <span style={styles.featureIcon}>🛠️</span>
                    <Typography variant="body1" style={styles.featureTitle}>Create Contests</Typography>
                  </div>
                  <Typography variant="body2" style={styles.featureDesc}>Design custom coding questions with time limits</Typography>
                </div>
                <div style={styles.featureCard}>
                  <div style={styles.featureHeader}>
                    <span style={styles.featureIcon}>🎯</span>
                    <Typography variant="body1" style={styles.featureTitle}>Join Contests</Typography>
                  </div>
                  <Typography variant="body2" style={styles.featureDesc}>Participate in coding challenges and submit solutions</Typography>
                </div>
                <div style={styles.featureCard}>
                  <div style={styles.featureHeader}>
                    <span style={styles.featureIcon}>🤝</span>
                    <Typography variant="body1" style={styles.featureTitle}>Peer Programming</Typography>
                  </div>
                  <Typography variant="body2" style={styles.featureDesc}>Collaborate with others in real-time coding sessions</Typography>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div style={{
          ...styles.rightSection,
          width: windowWidth <= 1024 ? '100%' : '50%'
        }}>
          <Card variant="elevated" style={styles.loginCard}>
            {/* Mobile Logo */}
            {windowWidth <= 1024 && (
              <div style={styles.mobileLogoSection}>
                <img src={logoImage} alt="CodeClash Logo" style={styles.mobileLogo} />
                <Typography variant="h3" style={styles.mobileTitle}>
                  Code<span style={styles.brandHighlight}>Clash</span>
                </Typography>
              </div>
            )}

            <div style={styles.loginContent}>
              <Typography variant="h2" style={styles.welcomeTitle}>
                Welcome to CodeClash
              </Typography>
              <Typography variant="body1" style={styles.welcomeSubtitle}>
                A simple platform for creating and participating in coding contests
              </Typography>

              <div style={styles.loginButtonContainer}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => loginWithRedirect()}
                  style={styles.primaryLoginButton}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 12px 40px rgba(99, 102, 241, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 8px 32px rgba(99, 102, 241, 0.3)';
                  }}
                >
                  <span style={styles.buttonIcon}>🚀</span>
                  Login to Continue
                </Button>
              </div>

              <div style={styles.loginInfo}>
                <Typography variant="body2" style={styles.infoText}>
                  🚀 Join 1000+ developers sharpening their coding skills daily
                </Typography>
              </div>
            </div>
          </Card>

          {/* Bottom Stats */}
          <div style={styles.statsContainer}>
            <div style={styles.statItem}>
              <Typography variant="h4" style={styles.statNumber}>50+</Typography>
              <Typography variant="body2" style={styles.statLabel}>Contests Created</Typography>
            </div>
            <div style={styles.statItem}>
              <Typography variant="h4" style={styles.statNumber}>200+</Typography>
              <Typography variant="body2" style={styles.statLabel}>Submissions</Typography>
            </div>
            <div style={styles.statItem}>
              <Typography variant="h4" style={styles.statNumber}>25+</Typography>
              <Typography variant="body2" style={styles.statLabel}>Active Users</Typography>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modern Theme Colors inspired by logo
const themeColors = {
  primary: {
    main: '#6366F1', // Indigo - main brand color
    light: '#818CF8',
    dark: '#4F46E5',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  secondary: {
    main: '#F59E0B', // Amber - accent color
    light: '#FCD34D',
    dark: '#D97706'
  },
  background: {
    primary: '#0F0F23', // Dark navy
    secondary: '#1A1A2E',
    card: '#16213E',
    glass: 'rgba(255, 255, 255, 0.1)'
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#A1A1AA',
    accent: '#E4E4E7'
  }
};

const styles = {
  container: {
    minHeight: '100vh',
    background: `linear-gradient(135deg, ${themeColors.background.primary} 0%, ${themeColors.background.secondary} 100%)`,
    position: 'relative',
    overflow: 'hidden',
    fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
  },
  
  backgroundOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
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
    zIndex: 0,
  },
  
  floatingShape2: {
    position: 'absolute',
    top: '60%',
    right: '15%',
    width: '200px',
    height: '200px',
    background: `linear-gradient(45deg, ${themeColors.secondary.main}15, ${themeColors.primary.light}15)`,
    borderRadius: '50%',
    filter: 'blur(80px)',
    animation: 'float 8s ease-in-out infinite reverse',
  },
  
  floatingShape3: {
    position: 'absolute',
    bottom: '20%',
    left: '60%',
    width: '150px',
    height: '150px',
    background: `linear-gradient(45deg, ${themeColors.primary.dark}25, ${themeColors.secondary.light}25)`,
    borderRadius: '50%',
    filter: 'blur(60px)',
    animation: 'float 10s ease-in-out infinite',
  },
  
  contentWrapper: {
    display: 'flex',
    minHeight: '100vh',
    position: 'relative',
    zIndex: 1,
  },
  
  leftSection: {
    width: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px',
    animation: 'slideInLeft 0.8s ease-out',
  },
  
  brandingCard: {
    maxWidth: '500px',
    textAlign: 'center',
  },
  
  logoContainer: {
    marginBottom: '30px',
    display: 'flex',
    justifyContent: 'center',
  },
  
  logo: {
    width: '100px',
    height: '100px',
    borderRadius: '16px',
    marginBottom: '16px',
    objectFit: 'cover',
  },
  
  logoTitleContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '8px',
  },
  
  brandTitle: {
    fontSize: '42px',
    fontWeight: 800,
    background: `linear-gradient(135deg, ${themeColors.primary.main}, ${themeColors.secondary.main})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '12px',
    letterSpacing: '-0.02em',
  },
  
  brandHighlight: {
    background: `linear-gradient(135deg, ${themeColors.primary.main}, ${themeColors.secondary.main})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  
  brandTagline: {
    fontSize: '16px',
    color: themeColors.text.secondary,
    marginBottom: '32px',
    fontWeight: 500,
    lineHeight: 1.6,
    letterSpacing: '0.5px',
    textAlign: 'center',
  },
  
  brandSubtitle: {
    fontSize: '20px',
    color: themeColors.text.secondary,
    marginBottom: '50px',
    fontWeight: 400,
  },
  
  featuresList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    textAlign: 'left',
  },
  
  featureCard: {
    background: themeColors.background.glass,
    borderRadius: '16px',
    padding: '24px',
    textAlign: 'center',
    backdropFilter: 'blur(20px)',
    border: `1px solid rgba(255, 255, 255, 0.1)`,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'default',
    position: 'relative',
    overflow: 'hidden',
  },
  
  featureHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px',
  },
  
  featureIcon: {
    fontSize: '24px',
    lineHeight: 1,
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: `linear-gradient(135deg, ${themeColors.primary.main}20, ${themeColors.secondary.main}20)`,
    borderRadius: '16px',
    border: `1px solid ${themeColors.primary.main}30`,
  },
  
  featureTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: themeColors.text.primary,
    marginBottom: '4px',
  },
  
  featureDesc: {
    fontSize: '14px',
    color: themeColors.text.secondary,
    lineHeight: 1.5,
  },
  
  rightSection: {
    width: '50%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 40px',
    gap: '40px',
    animation: 'slideInRight 0.8s ease-out',
  },
  
  loginCard: {
    width: '100%',
    maxWidth: '480px',
    padding: '48px',
    background: `${themeColors.background.card}E6`,
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    border: `1px solid rgba(255, 255, 255, 0.1)`,
    boxShadow: '0 32px 80px rgba(0, 0, 0, 0.3)',
  },
  
  mobileLogoSection: {
    textAlign: 'center',
    marginBottom: '40px',
  },
  
  mobileLogo: {
    width: '80px',
    height: '80px',
    borderRadius: '16px',
    objectFit: 'cover',
    marginBottom: '16px',
  },
  
  mobileTitle: {
    fontSize: '32px',
  },
  
  welcomeTitle: {
    fontSize: '28px',
    fontWeight: 700,
    color: themeColors.text.primary,
    marginBottom: '12px',
    letterSpacing: '-0.01em',
  },
  
  welcomeSubtitle: {
    fontSize: '16px',
    color: themeColors.text.secondary,
    marginBottom: '28px',
    lineHeight: 1.6,
  },
  
  loginButtonContainer: {
    marginBottom: '32px',
  },
  
  primaryLoginButton: {
    width: '100%',
    height: '56px',
    background: `linear-gradient(135deg, ${themeColors.primary.main}, ${themeColors.primary.dark})`,
    borderRadius: '16px',
    fontSize: '16px',
    fontWeight: 600,
    textTransform: 'none',
    boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3)',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
  },
  
  buttonIcon: {
    fontSize: '20px',
  },
  
  divider: {
    position: 'relative',
    textAlign: 'center',
    marginBottom: '32px',
  },
  
  dividerText: {
    fontSize: '14px',
    color: themeColors.text.secondary,
    backgroundColor: themeColors.background.card,
    padding: '0 20px',
    position: 'relative',
    zIndex: 1,
  },
  
  loginInfo: {
    marginTop: '24px',
    textAlign: 'center',
  },
  
  infoText: {
    color: themeColors.text.secondary,
    fontSize: '14px',
    lineHeight: 1.5,
  },
  
  guestSection: {
    textAlign: 'center',
  },
  
  guestText: {
    fontSize: '14px',
    color: themeColors.text.secondary,
    marginBottom: '16px',
  },
  
  guestButton: {
    width: '100%',
    height: '48px',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: 500,
    textTransform: 'none',
    border: `1px solid ${themeColors.primary.main}60`,
    color: themeColors.primary.main,
    backgroundColor: 'transparent',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  
  statsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: '480px',
    padding: '24px',
    background: themeColors.background.glass,
    borderRadius: '16px',
    backdropFilter: 'blur(20px)',
    border: `1px solid rgba(255, 255, 255, 0.1)`,
    animation: 'fadeInUp 1s ease-out 0.3s both',
  },
  
  statItem: {
    textAlign: 'center',
    flex: 1,
  },
  
  statNumber: {
    fontSize: '24px',
    fontWeight: 700,
    color: themeColors.text.primary,
    marginBottom: '4px',
  },
  
  statLabel: {
    fontSize: '12px',
    color: themeColors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  
  // Logged in state styles
  containerLoggedIn: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: `linear-gradient(135deg, ${themeColors.background.primary} 0%, ${themeColors.background.secondary} 100%)`,
    padding: '20px',
  },
  
  loggedInCard: {
    padding: '48px',
    textAlign: 'center',
    maxWidth: '400px',
    width: '100%',
    borderRadius: '24px',
    background: `${themeColors.background.card}E6`,
    backdropFilter: 'blur(20px)',
    border: `1px solid rgba(255, 255, 255, 0.1)`,
    boxShadow: '0 32px 80px rgba(0, 0, 0, 0.3)',
  },
  
  welcomeMessage: {
    color: themeColors.text.primary,
    marginBottom: '30px',
    fontWeight: 600,
    fontSize: '28px',
  },
  
  logoutButtonSmall: {
    padding: '12px 32px',
    borderRadius: '12px',
    textTransform: 'none',
    fontWeight: 600,
    background: `linear-gradient(135deg, #EF4444, #DC2626)`,
    border: 'none',
    color: 'white',
    boxShadow: '0 8px 32px rgba(239, 68, 68, 0.3)',
    transition: 'all 0.3s ease',
  },
};

export default LoginPage;
