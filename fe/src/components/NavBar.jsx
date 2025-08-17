import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { Button, Container, Typography } from './ui';
import { colors, shadows } from '../theme';

const NavBar = () => {
  const { logout, user } = useAuth0();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav style={styles.navbar}>
      <Container maxWidth="lg" style={styles.container}>
        {/* Logo */}
        <div style={styles.logo}>
          <Link to="/" style={styles.logoLink}>
            <Typography variant="h4" style={{ margin: 0, color: '#fff' }}>
              <span style={styles.logoText}>Code<span style={styles.logoHighlight}>Clash</span></span>
            </Typography>
          </Link>
        </div>

        {/* Mobile menu button */}
        {isMobile && (
          <div style={styles.mobileMenuButton} onClick={toggleMobileMenu}>
            <div style={styles.menuIcon}></div>
            <div style={styles.menuIcon}></div>
            <div style={styles.menuIcon}></div>
          </div>
        )}

        {/* Navigation Links */}
        <ul style={{
          ...styles.navList,
          ...(isMobile && mobileMenuOpen ? styles.navListMobileOpen : {}),
          display: isMobile && !mobileMenuOpen ? 'none' : 'flex'
        }}>
          <li style={isMobile ? {...styles.navItem, ...styles.navItemMobile} : styles.navItem}>
            <Link to="/mode" style={styles.link}>Home</Link>
          </li>
          <li style={isMobile ? {...styles.navItem, ...styles.navItemMobile} : styles.navItem}>
            <Link to="/mode/peer-mode" style={styles.link}>Peer Mode</Link>
          </li>
          <li style={isMobile ? {...styles.navItem, ...styles.navItemMobile} : styles.navItem}>
            <Link to="/mode/contest-mode" style={styles.link}>Contest Mode</Link>
          </li>
          {user && (
            <li style={styles.navItem}>
              <div style={styles.userInfo}>
                {user.picture && (
                  <img src={user.picture} alt={user.name} style={styles.userAvatar} />
                )}
                <span style={styles.userName}>{user.name}</span>
              </div>
            </li>
          )}
          <li style={styles.navItem}>
            <Button
              variant="outlined"
              onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
              style={styles.logoutButton}
            >
              Logout
            </Button>
          </li>
        </ul>
      </Container>
    </nav>
  );
};

const styles = {
  navbar: {
    background: `linear-gradient(135deg, ${colors.primary.main}, ${colors.primary.dark})`,
    boxShadow: shadows.medium,
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    padding: '12px 0',
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
  },
  logoLink: {
    textDecoration: 'none',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
  },
  logoText: {
    fontWeight: 700,
    letterSpacing: '0.5px',
  },
  logoHighlight: {
    color: colors.secondary.main,
  },
  mobileMenuButton: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '30px',
    height: '21px',
    cursor: 'pointer',
  },
  menuIcon: {
    width: '100%',
    height: '3px',
    backgroundColor: '#fff',
    borderRadius: '3px',
  },
  navList: {
    display: 'flex',
    alignItems: 'center',
    listStyle: 'none',
    margin: 0,
    padding: 0,
    transition: 'all 0.3s ease',
  },
  navListMobileOpen: {
    position: 'absolute',
    top: '60px',
    right: '0',
    flexDirection: 'column',
    backgroundColor: colors.primary.dark,
    width: '70%',
    borderRadius: '0 0 10px 10px',
    boxShadow: shadows.large,
    zIndex: 1000,
    padding: '1rem 0',
  },
  navItem: {
    margin: '0 0.5rem',
  },
  navItemMobile: {
    margin: '0.5rem 0',
    width: '100%',
    textAlign: 'center',
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    transition: 'background-color 0.3s ease',
    display: 'block',
    fontWeight: 500,
  },
  logoutButton: {
    backgroundColor: 'transparent',
    color: '#fff',
    border: '1px solid #fff',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontWeight: 500,
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    color: '#fff',
    padding: '0.5rem 1rem',
  },
  userAvatar: {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    marginRight: '0.5rem',
    border: '2px solid ' + colors.secondary.main,
  },
  userName: {
    fontWeight: 500,
  },
};

export default NavBar;
