// components/LoginPage.jsx
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
        <button style={styles.logoutButton} onClick={() => logout()}>Logout</button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Welcome to Coding Mates</h1>
        <p style={styles.subtitle}>Collaborate, code, and grow with peers in a dynamic environment designed for programmers.</p>
      </header>

      <main style={styles.mainContent}>
        {/* <img
          src="https://via.placeholder.com/600x300" // Replace with a relevant image URL
          alt="Coding Mates Illustration"
          style={styles.image}
        /> */}
        <button style={styles.loginButton} onClick={() => loginWithRedirect()}>
          Login to Get Started
        </button>
      </main>

      <footer style={styles.footer}>
        <p>&copy; {new Date().getFullYear()} Coding Mates. All rights reserved.</p>
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
    padding: '20px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  title: {
    fontSize: '36px',
    color: '#463E7D',
    marginBottom: '10px',
  },
  subtitle: {
    fontSize: '18px',
    color: '#6B7280',
    maxWidth: '600px',
    margin: '0 auto',
  },
  mainContent: {
    textAlign: 'center',
  },
  image: {
    maxWidth: '100%',
    borderRadius: '8px',
    marginBottom: '20px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  loginButton: {
    backgroundColor: '#463E7D',
    color: '#FFFFFF',
    border: 'none',
    padding: '10px 20px',
    fontSize: '16px',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  loginButtonHover: {
    backgroundColor: '#5B4D9C',
  },
  footer: {
    textAlign: 'center',
    fontSize: '14px',
    color: '#6B7280',
    marginTop: '20px',
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
