import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const { user, loginWithRedirect, isAuthenticated, logout } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/mode'); // Redirect to /mode after login
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated) {
    return (
      <div style={styles.containerLoggedIn}>
        <h2 style={styles.welcomeMessage}>Welcome back, {user.name}!</h2>
        <button style={styles.logoutButton} onClick={() => logout()}>
          Logout
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Welcome to Code Clash</h1>
        <p style={styles.subtitle}>
          A platform where programmers collaborate, code, and grow together.
        </p>
      </header>

      <main style={styles.mainContent}>
        <div style={styles.heroSection}>
          <div style={styles.heroText}>
            <h2 style={styles.heroTitle}>Let's get started with Code Clash!</h2>
            <p style={styles.heroDescription}>
              Join our community to participate in coding challenges, peer programming, and enhance your skills!
            </p>
            <button style={styles.loginButton} onClick={() => loginWithRedirect()}>
              Login to Get Started
            </button>
          </div>

        </div>
      </main>

      <footer style={styles.footer}>
        <p>&copy; {new Date().getFullYear()} Code Clash. All rights reserved.</p>
        <div style={styles.footerLinks}>
          <a href="/privacy-policy" style={styles.footerLink}>Privacy Policy</a> | 
          <a href="/terms-of-service" style={styles.footerLink}>Terms of Service</a>
        </div>
      </footer>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "'Roboto', sans-serif",
    backgroundColor: '#F7F9FC',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '40px 20px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
  },
  title: {
    fontSize: '40px',
    color: '#463E7D',
    marginBottom: '20px',
  },
  subtitle: {
    fontSize: '18px',
    color: '#6B7280',
    maxWidth: '700px',
    margin: '0 auto',
  },
  mainContent: {
    textAlign: 'center',
    marginTop: '30px',
  },
  heroSection: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1100px',
    margin: '0 auto',
  },
  heroText: {
    flex: 1,
    padding: '20px',
  },
  heroTitle: {
    fontSize: '30px',
    color: '#463E7D',
    marginBottom: '15px',
  },
  heroDescription: {
    fontSize: '16px',
    color: '#6B7280',
    marginBottom: '20px',
  },
  loginButton: {
    backgroundColor: '#463E7D',
    color: '#FFFFFF',
    border: 'none',
    padding: '15px 25px',
    fontSize: '18px',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    width: '200px',
  },
  heroImage: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
  },
  image: {
    maxWidth: '100%',
    borderRadius: '8px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
  },
  footer: {
    textAlign: 'center',
    fontSize: '14px',
    color: '#6B7280',
    marginTop: '40px',
  },
  footerLinks: {
    marginTop: '10px',
  },
  footerLink: {
    color: '#463E7D',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  containerLoggedIn: {
    fontFamily: "'Roboto', sans-serif",
    backgroundColor: '#F7F9FC',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  welcomeMessage: {
    fontSize: '24px',
    color: '#463E7D',
    marginBottom: '20px',
  },
  logoutButton: {
    backgroundColor: '#E63946',
    color: '#FFFFFF',
    border: 'none',
    padding: '10px 20px',
    fontSize: '16px',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
};

export default LoginPage;
