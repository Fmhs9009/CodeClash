import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

const NavBar = () => {
  const { isAuthenticated, logout, user } = useAuth0();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold text-primary" to="/">
          CodeClash
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          {isAuthenticated && (
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link
                  to="/mode"
                  className={`nav-link ${isActive('/mode') ? 'active' : ''}`}
                >
                  Mode Selection
                </Link>
              </li>
              {/* Add more navigation items here */}
            </ul>
          )}
          
          <div className="d-flex align-items-center">
            {isAuthenticated ? (
              <>
                <span className="text-muted me-3">{user?.name}</span>
                <button
                  onClick={() => logout()}
                  className="btn btn-outline-primary"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/" className="btn btn-primary">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
