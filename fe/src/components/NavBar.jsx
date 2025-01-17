import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

const NavBar = () => {
  const { logout } = useAuth0();

  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>
        {/* Logo */}
        <div style={styles.logo}>
          <Link to="/" style={styles.logoLink}>CodeClash</Link>
        </div>

        {/* Navigation Links */}
        <ul style={styles.navList}>
          <li style={styles.navItem}>
            <Link to="/mode" style={styles.link}>Home</Link>
          </li>
          <li style={styles.navItem}>
            <Link to="/mode/peer-mode" style={styles.link}>Peer Mode</Link>
          </li>
          <li style={styles.navItem}>
            <Link to="/mode/contest-mode" style={styles.link}>Contest Mode</Link>
          </li>
          <li style={styles.navItem}>
            <button
              onClick={() => logout({ returnTo: window.location.origin })}
              style={styles.logoutButton}
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    background: 'linear-gradient(135deg, #6A5ACD, #463E7D)', // Gradient background
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)', // Slightly stronger shadow for modern look
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    padding: '10px 0', // Reduced padding for compact look
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 20px',
  },
  logo: {
    fontSize: '30px',
    fontWeight: 'bold',
    letterSpacing: '1px',
  },
  logoLink: {
    textDecoration: 'none',
    color: '#FFFFFF',
  },
  navList: {
    display: 'flex',
    listStyle: 'none',
    margin: 0,
    alignItems:'center',
    padding: 0,
    gap: '30px', // Increased gap for more breathing room
  },
  navItem: {
    position: 'relative',
  },
  link: {
    textDecoration: 'none',
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: '16px',
    padding: '12px 18px', // Increased padding for a bigger button
    borderRadius: '30px', // Rounded buttons
    transition: 'background-color 0.3s, color 0.3s, transform 0.2s',
  },
  linkHover: {
    backgroundColor: '#5A4F8E',
  },
  logoutButton: {
    backgroundColor: '#FF4D4D',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '30px', // Rounded button for consistency
    padding: '12px 18px', // Similar size as links
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s, transform 0.2s',
  },
  logoutButtonHover: {
    backgroundColor: '#E54444',
    transform: 'scale(1.05)',
  },
};

export default NavBar;
