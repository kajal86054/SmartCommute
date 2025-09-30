import React, { useState, useEffect } from 'react';
import { ridesAPI } from '../services/apiService';
import { useAuth } from '../services/AuthContext';
import RideCard from '../components/common/RideCard';
import Loading from '../components/common/Loading';
import './FindRides.css';

const FindRides = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    origin: '',
    destination: '',
    date: '',
    minSeats: '',
    maxPrice: ''
  });
  const [searching, setSearching] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    fetchRides();
  }, []);

  const fetchRides = async (searchFilters = {}) => {
    setSearching(true);
    try {
      const response = await ridesAPI.getRides(searchFilters);
      if (response.data.success) {
        setRides(response.data.data.rides);
      }
    } catch (error) {
      console.error('Fetch rides error:', error);
    } finally {
      setLoading(false);
      setSearching(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const searchFilters = {};

    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        searchFilters[key] = filters[key];
      }
    });

    fetchRides(searchFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      origin: '',
      destination: '',
      date: '',
      minSeats: '',
      maxPrice: ''
    });
    fetchRides();
  };

  const handleJoinSuccess = (rideId) => {
    // Refresh the ride data
    fetchRides(filters);
  };

  if (loading) {
    return <Loading message="Loading available rides..." />;
  }

  return (
    <div className="find-rides">
      <div className="container">
        <div className="find-rides-header">
          <h1>Find Rides</h1>
          <p>Discover available rides for your journey</p>
        </div>

        <div className="search-section">
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-filters">
              <div className="filter-group">
                <label htmlFor="origin" className="filter-label">From</label>
                <input
                  type="text"
                  id="origin"
                  name="origin"
                  value={filters.origin}
                  onChange={handleFilterChange}
                  className="filter-input"
                  placeholder="Origin city"
                />
              </div>

              <div className="filter-group">
                <label htmlFor="destination" className="filter-label">To</label>
                <input
                  type="text"
                  id="destination"
                  name="destination"
                  value={filters.destination}
                  onChange={handleFilterChange}
                  className="filter-input"
                  placeholder="Destination city"
                />
              </div>

              <div className="filter-group">
                <label htmlFor="date" className="filter-label">Date</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={filters.date}
                  onChange={handleFilterChange}
                  className="filter-input"
                />
              </div>

              <div className="filter-group">
                <label htmlFor="minSeats" className="filter-label">Min Seats</label>
                <select
                  id="minSeats"
                  name="minSeats"
                  value={filters.minSeats}
                  onChange={handleFilterChange}
                  className="filter-input"
                >
                  <option value="">Any</option>
                  {[1,2,3,4,5,6,7,8].map(num => (
                    <option key={num} value={num}>{num}+</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label htmlFor="maxPrice" className="filter-label">Max Price</label>
                <input
                  type="number"
                  id="maxPrice"
                  name="maxPrice"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  className="filter-input"
                  placeholder="₹"
                  min="0"
                />
              </div>
            </div>

            <div className="search-actions">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={searching}
              >
                {searching ? 'Searching...' : 'Search Rides'}
              </button>
              <button
                type="button"
                onClick={handleClearFilters}
                className="btn btn-secondary"
                disabled={searching}
              >
                Clear Filters
              </button>
            </div>
          </form>
        </div>

        <div className="rides-section">
          <div className="rides-header">
            <h2>Available Rides ({rides.length})</h2>
          </div>

          {rides.length === 0 ? (
            <div className="no-rides">
              <div className="no-rides-icon">🚗</div>
              <h3>No rides found</h3>
              <p>Try adjusting your search criteria or check back later for new rides.</p>
            </div>
          ) : (
            <div className="rides-grid">
              {rides.map(ride => (
                <RideCard
                  key={ride._id}
                  ride={ride}
                  currentUserId={user?._id}
                  onJoinSuccess={handleJoinSuccess}
                  showJoinButton={true}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindRides;