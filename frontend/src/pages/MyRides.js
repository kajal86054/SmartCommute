import React, { useState, useEffect } from 'react';
import { ridesAPI } from '../services/apiService';
import { useAuth } from '../services/AuthContext';
import RideCard from '../components/common/RideCard';
import Loading from '../components/common/Loading';
import { Link } from 'react-router-dom';
import './MyRides.css';

const MyRides = () => {
  const [activeTab, setActiveTab] = useState('posted');
  const [postedRides, setPostedRides] = useState([]);
  const [joinedRides, setJoinedRides] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  useEffect(() => {
    fetchMyRides();
    fetchJoinedRides();
  }, []);

  const fetchMyRides = async () => {
    try {
      const response = await ridesAPI.getMyRides();
      if (response.data.success) {
        setPostedRides(response.data.data);
      }
    } catch (error) {
      console.error('Fetch my rides error:', error);
    }
  };

  const fetchJoinedRides = async () => {
    try {
      const response = await ridesAPI.getJoinedRides();
      if (response.data.success) {
        setJoinedRides(response.data.data);
      }
    } catch (error) {
      console.error('Fetch joined rides error:', error);
    } finally {
      setLoading(false);
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

  const getStatusBadge = (status) => {
    const statusClasses = {
      active: 'status-active',
      full: 'status-full',
      completed: 'status-completed',
      cancelled: 'status-cancelled'
    };

    return (
      <span className={`status-badge ${statusClasses[status] || ''}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return <Loading message="Loading your rides..." />;
  }

  return (
    <div className="my-rides">
      <div className="container">
        <div className="my-rides-header">
          <h1>My Rides</h1>
          <p>Manage your posted rides and track your bookings</p>
        </div>

        <div className="tabs-section">
          <div className="tabs">
            <button
              className={`tab ${activeTab === 'posted' ? 'active' : ''}`}
              onClick={() => setActiveTab('posted')}
            >
              Posted Rides ({postedRides.length})
            </button>
            <button
              className={`tab ${activeTab === 'joined' ? 'active' : ''}`}
              onClick={() => setActiveTab('joined')}
            >
              Joined Rides ({joinedRides.length})
            </button>
          </div>
        </div>

        <div className="tab-content">
          {activeTab === 'posted' && (
            <div className="posted-rides">
              {postedRides.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">🚗</div>
                  <h3>No rides posted yet</h3>
                  <p>Start sharing your journey by posting your first ride.</p>
                  <Link to="/post-ride" className="btn btn-primary">
                    Post Your First Ride
                  </Link>
                </div>
              ) : (
                <div className="rides-list">
                  {postedRides.map(ride => (
                    <div key={ride._id} className="my-ride-card">
                      <div className="ride-info">
                        <div className="route-info">
                          <h3 className="route">
                            {ride.origin} → {ride.destination}
                          </h3>
                          <div className="ride-meta">
                            <span className="date">{formatDate(ride.departureDate)}</span>
                            <span className="time">{ride.departureTime}</span>
                            <span className="price">₹{ride.price}</span>
                            {getStatusBadge(ride.status)}
                          </div>
                        </div>

                        <div className="passengers-info">
                          <h4>Passengers ({ride.passengers.length}/{ride.seatsAvailable})</h4>
                          {ride.passengers.length === 0 ? (
                            <p className="no-passengers">No passengers yet</p>
                          ) : (
                            <div className="passengers-list">
                              {ride.passengers.map((passenger, index) => (
                                <div key={index} className="passenger">
                                  <span className="passenger-name">
                                    {passenger.user.firstName} {passenger.user.lastName}
                                  </span>
                                  <span className={`passenger-status ${passenger.status}`}>
                                    {passenger.status}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {ride.description && (
                          <div className="ride-description">
                            <h4>Description</h4>
                            <p>{ride.description}</p>
                          </div>
                        )}
                      </div>

                      <div className="ride-actions">
                        <button className="btn btn-outline btn-sm">
                          View Details
                        </button>
                        {ride.status === 'active' && (
                          <button className="btn btn-secondary btn-sm">
                            Edit Ride
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'joined' && (
            <div className="joined-rides">
              {joinedRides.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">🎫</div>
                  <h3>No rides joined yet</h3>
                  <p>Explore available rides and book your next journey.</p>
                  <Link to="/find-rides" className="btn btn-primary">
                    Find Rides
                  </Link>
                </div>
              ) : (
                <div className="rides-grid">
                  {joinedRides.map(ride => (
                    <RideCard
                      key={ride._id}
                      ride={ride}
                      currentUserId={user?._id}
                      showJoinButton={false}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyRides;