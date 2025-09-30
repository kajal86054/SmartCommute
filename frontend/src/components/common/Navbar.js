import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/" className="navbar-logo">
            <span className="logo-icon">🚗</span>
            <span className="logo-text">SmartCommute</span>
          </Link>
        </div>

        <div className="navbar-menu">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="navbar-item">
                Dashboard
              </Link>
              <Link to="/find-rides" className="navbar-item">
                Find Rides
              </Link>
              <Link to="/post-ride" className="navbar-item">
                Post Ride
              </Link>
              <Link to="/my-rides" className="navbar-item">
                My Rides
              </Link>
              <div className="navbar-user">
                <span className="navbar-username">
                  {user?.firstName} {user?.lastName}
                </span>
                <button onClick={handleLogout} className="navbar-logout">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-item">
                Login
              </Link>
              <Link to="/register" className="navbar-item navbar-cta">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;