import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>Welcome back, {user?.firstName}!</h1>
          <p>Your SmartCommute dashboard</p>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>Profile Completion</h3>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${user?.profileCompletion || 0}%` }}
              ></div>
            </div>
            <p>{user?.profileCompletion || 0}% Complete</p>
          </div>

          <div className="dashboard-card">
            <h3>Trust Score</h3>
            <div className="trust-score">
              <span className="score">{user?.trustScore || 0}</span>
              <span className="max">/5</span>
            </div>
            <p>Based on {user?.totalRatings || 0} ratings</p>
          </div>

          <div className="dashboard-card">
            <h3>Account Status</h3>
            <div className="status-items">
              <div className="status-item">
                <span className="status-label">Email:</span>
                <span className="status-verified">✓ Verified</span>
              </div>
              <div className="status-item">
                <span className="status-label">Phone:</span>
                <span className="status-verified">✓ Verified</span>
              </div>
            </div>
          </div>

          <div className="dashboard-card full-width">
            <h3>Quick Actions</h3>
            <div className="action-buttons">
              <Link to="/find-rides" className="btn btn-primary">
                Find Rides
              </Link>
              <Link to="/post-ride" className="btn btn-outline">
                Post a Ride
              </Link>
              <Link to="/my-rides" className="btn btn-secondary">
                My Rides
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;