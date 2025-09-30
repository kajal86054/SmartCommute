import React from 'react';
import { ridesAPI } from '../../services/apiService';
import { toast } from 'react-toastify';
import './RideCard.css';

const RideCard = ({ ride, onJoinSuccess, showJoinButton = true, currentUserId }) => {
  const handleJoinRide = async () => {
    try {
      await ridesAPI.joinRide(ride._id);
      toast.success('Successfully joined the ride!');
      if (onJoinSuccess) {
        onJoinSuccess(ride._id);
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to join ride';
      toast.error(message);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isOwner = ride.driver._id === currentUserId;
  const isAlreadyJoined = ride.passengers.some(p => p.user._id === currentUserId);
  const availableSeats = ride.seatsAvailable - ride.passengers.length;

  return (
    <div className="ride-card">
      <div className="ride-header">
        <div className="route">
          <span className="origin">{ride.origin}</span>
          <span className="arrow">→</span>
          <span className="destination">{ride.destination}</span>
        </div>
        <div className="price">₹{ride.price}</div>
      </div>

      <div className="ride-details">
        <div className="detail-item">
          <span className="label">Date:</span>
          <span className="value">{formatDate(ride.departureDate)}</span>
        </div>
        <div className="detail-item">
          <span className="label">Time:</span>
          <span className="value">{ride.departureTime}</span>
        </div>
        <div className="detail-item">
          <span className="label">Available Seats:</span>
          <span className="value">{availableSeats}</span>
        </div>
      </div>

      <div className="driver-info">
        <div className="driver-details">
          <span className="driver-name">
            {ride.driver.firstName} {ride.driver.lastName}
          </span>
          <div className="trust-info">
            <span className="trust-score">
              ⭐ {ride.driver.trustScore || 0}/5
            </span>
            <span className="total-ratings">
              ({ride.driver.totalRatings || 0} ratings)
            </span>
          </div>
        </div>
      </div>

      {ride.description && (
        <div className="ride-description">
          <p>{ride.description}</p>
        </div>
      )}

      <div className="ride-actions">
        {showJoinButton && !isOwner && !isAlreadyJoined && availableSeats > 0 && (
          <button 
            className="btn btn-primary"
            onClick={handleJoinRide}
          >
            Join Ride
          </button>
        )}
        {isOwner && (
          <span className="owner-badge">Your Ride</span>
        )}
        {isAlreadyJoined && !isOwner && (
          <span className="joined-badge">Already Joined</span>
        )}
        {availableSeats === 0 && (
          <span className="full-badge">Full</span>
        )}
      </div>
    </div>
  );
};

export default RideCard;