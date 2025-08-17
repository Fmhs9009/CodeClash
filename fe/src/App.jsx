import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useState, useEffect } from 'react';
import Mode from './components/Mode';
import PeerMode from './components/PeerMode';
import ContestMode from './components/ContestMode';
import ContestPage from './components/ContestPage';
import LoginPage from './components/LoginPage';
import Layout from './components/Layout';

// Auth0 Callback Component
const Auth0Callback = () => {
  const { error } = useAuth0();
  
  if (error) {
    console.error('Auth0 Error:', error);
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Authentication Error</h2>
        <p>{error.message}</p>
        <button onClick={() => window.location.href = '/'}>
          Return to Login
        </button>
      </div>
    );
  }
  
  return <div>Processing authentication...</div>;
};

// PrivateRoute component to guard routes
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, isLoading, loginWithRedirect, error, user } = useAuth0();
  const [showLoading, setShowLoading] = useState(true);

  // Reduce loading screen time - hide after 500ms if still loading
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading) {
        console.log('⚡ Fast-tracking auth check...');
        setShowLoading(false);
      }
    }, 500);

    if (!isLoading) {
      setShowLoading(false);
      clearTimeout(timer);
    }

    return () => clearTimeout(timer);
  }, [isLoading]);

  console.log('🔒 PrivateRoute Status:', { isAuthenticated, isLoading, error, user: !!user });

  // Skip loading screen if user is already authenticated
  if (isAuthenticated) {
    return children;
  }

  // Show minimal loading only for very short time
  if (isLoading && showLoading) {
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center',
        minHeight: '200px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div>
          <div style={{ fontSize: '24px', marginBottom: '10px' }}>⚡</div>
          <div>Checking session...</div>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('❌ Auth0 Error in PrivateRoute:', error);
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>❌ Authentication Error</h2>
        <p>{error.message}</p>
        <button onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  // Check localStorage for cached auth state to avoid unnecessary redirects
  const authKey = `@@auth0spajs@@::${import.meta.env.VITE_AUTH0_CLIENT_ID}::${import.meta.env.VITE_AUTH0_DOMAIN}::openid profile email`;
  const cachedAuth = localStorage.getItem(authKey);
  let hasValidToken = false;
  
  try {
    if (cachedAuth) {
      const authData = JSON.parse(cachedAuth);
      hasValidToken = authData && authData.access_token && new Date(authData.expires_at * 1000) > new Date();
    }
  } catch (e) {
    console.log('📦 Auth cache parse error:', e);
  }
  
  if (!isAuthenticated && !hasValidToken) {
    console.log('🔓 User not authenticated, redirecting to login...');
    loginWithRedirect({
      appState: { returnTo: window.location.pathname }
    });
    return null; // Prevent rendering while redirecting
  }

  // If we have valid cached auth but Auth0 says not authenticated, wait a bit more
  if (!isAuthenticated && hasValidToken) {
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center',
        minHeight: '200px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div>
          <div style={{ fontSize: '24px', marginBottom: '10px' }}>🔄</div>
          <div>Restoring session...</div>
        </div>
      </div>
    );
  }

  return children;
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/callback" element={<Auth0Callback />} />
        <Route path="/contest-mode/contest-page/:id" element={<ContestPage />} />

        {/* Protected Routes */}
        <Route
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route path="/mode" element={<Mode />} />
          <Route path="/mode/contest-mode" element={<ContestMode />} />
          <Route path="/mode/peer-mode" element={<PeerMode />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;