import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import './Home.css';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Smart<span className="text-primary">Commute</span>
            </h1>
            <p className="hero-subtitle">
              Carpool for Long Rides
            </p>
            <p className="hero-description">
              Connect with trusted travelers for safe, affordable long-distance journeys. 
              Reduce costs, build connections, and help the environment with our 
              trust-based carpooling platform.
            </p>
            <div className="hero-actions">
              {!isAuthenticated ? (
                <>
                  <Link to="/register" className="btn btn-primary btn-lg">
                    Get Started
                  </Link>
                  <Link to="/login" className="btn btn-outline btn-lg">
                    Sign In
                  </Link>
                </>
              ) : (
                <div className="authenticated-actions">
                  <Link to="/find-rides" className="btn btn-primary btn-lg">
                    Find Rides
                  </Link>
                  <Link to="/post-ride" className="btn btn-outline btn-lg">
                    Post a Ride
                  </Link>
                </div>
              )}
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-graphic">
              <div className="car-icon">🚗</div>
              <div className="route-line"></div>
              <div className="destination-icon">📍</div>
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2 className="section-title">Why Choose SmartCommute?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🛡️</div>
              <h3>Trust & Safety</h3>
              <p>Multi-dimensional trust scoring system with verified profiles and comprehensive rating system.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3>Cost Effective</h3>
              <p>Share travel costs with fellow passengers and save money on long-distance journeys.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌱</div>
              <h3>Eco Friendly</h3>
              <p>Reduce carbon footprint by sharing rides and contributing to a greener environment.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Easy to Use</h3>
              <p>Simple interface for posting rides, finding matches, and managing your travel plans.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔄</div>
              <h3>Real-time Updates</h3>
              <p>Stay connected with instant notifications and live journey tracking features.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">✅</div>
              <h3>Verified Users</h3>
              <p>All users go through verification for added security and trust.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <div className="steps-grid">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Sign Up & Create Profile</h3>
              <p>Create your account and complete your profile to build trust with other users.</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Post or Find Rides</h3>
              <p>Create ride offers or search for available rides based on your route and timing.</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Connect & Travel</h3>
              <p>Join rides or accept passengers and enjoy a safe, shared journey.</p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <h3>Rate & Review</h3>
              <p>Rate your travel companions to help build a trusted community.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Your Journey?</h2>
            <p>Join thousands of travelers who trust SmartCommute for their long-distance rides.</p>
            {!isAuthenticated && (
              <Link to="/register" className="btn btn-primary btn-lg">
                Join SmartCommute Today
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;