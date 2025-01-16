import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import Mode from './components/Mode';
import PeerMode from './components/PeerMode';
import ContestMode from './components/ContestMode';
import ContestPage from './components/ContestPage';
import LoginPage from './components/LoginPage';
import Layout from './components/Layout';

// PrivateRoute component to guard routes
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  if (isLoading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    loginWithRedirect();
    return null; // Prevent rendering while redirecting
  }

  return children;
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<LoginPage />} />
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