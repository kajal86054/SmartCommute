import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ridesAPI } from '../services/apiService';
import { toast } from 'react-toastify';
import './PostRide.css';

const PostRide = () => {
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    departureDate: '',
    departureTime: '',
    seatsAvailable: 1,
    price: '',
    description: '',
    vehicleInfo: {
      make: '',
      model: '',
      color: '',
      licensePlate: ''
    },
    preferences: {
      smokingAllowed: false,
      petsAllowed: false,
      musicOk: true,
      chatty: true
    }
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }

    // Clear errors
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.origin.trim()) {
      newErrors.origin = 'Origin is required';
    }

    if (!formData.destination.trim()) {
      newErrors.destination = 'Destination is required';
    }

    if (!formData.departureDate) {
      newErrors.departureDate = 'Departure date is required';
    } else if (new Date(formData.departureDate) <= new Date()) {
      newErrors.departureDate = 'Departure date must be in the future';
    }

    if (!formData.departureTime) {
      newErrors.departureTime = 'Departure time is required';
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Valid price is required';
    }

    if (formData.seatsAvailable < 1 || formData.seatsAvailable > 8) {
      newErrors.seatsAvailable = 'Seats must be between 1 and 8';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const rideData = {
        ...formData,
        price: parseFloat(formData.price),
        seatsAvailable: parseInt(formData.seatsAvailable)
      };

      await ridesAPI.createRide(rideData);
      toast.success('Ride posted successfully!');
      navigate('/my-rides');
    } catch (error) {
      console.error('Post ride error:', error);
      const message = error.response?.data?.message || 'Failed to post ride';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-ride">
      <div className="container">
        <div className="post-ride-header">
          <h1>Post a New Ride</h1>
          <p>Share your journey and connect with fellow travelers</p>
        </div>

        <div className="post-ride-card">
          <form onSubmit={handleSubmit} className="post-ride-form">
            <div className="form-section">
              <h3>Journey Details</h3>

              <div className="row">
                <div className="col-6">
                  <div className="form-group">
                    <label htmlFor="origin" className="form-label">
                      From (Origin) *
                    </label>
                    <input
                      type="text"
                      id="origin"
                      name="origin"
                      value={formData.origin}
                      onChange={handleChange}
                      className={`form-control ${errors.origin ? 'error' : ''}`}
                      placeholder="e.g. Mumbai"
                      disabled={loading}
                    />
                    {errors.origin && (
                      <span className="form-error">{errors.origin}</span>
                    )}
                  </div>
                </div>

                <div className="col-6">
                  <div className="form-group">
                    <label htmlFor="destination" className="form-label">
                      To (Destination) *
                    </label>
                    <input
                      type="text"
                      id="destination"
                      name="destination"
                      value={formData.destination}
                      onChange={handleChange}
                      className={`form-control ${errors.destination ? 'error' : ''}`}
                      placeholder="e.g. Pune"
                      disabled={loading}
                    />
                    {errors.destination && (
                      <span className="form-error">{errors.destination}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-6">
                  <div className="form-group">
                    <label htmlFor="departureDate" className="form-label">
                      Departure Date *
                    </label>
                    <input
                      type="date"
                      id="departureDate"
                      name="departureDate"
                      value={formData.departureDate}
                      onChange={handleChange}
                      className={`form-control ${errors.departureDate ? 'error' : ''}`}
                      disabled={loading}
                    />
                    {errors.departureDate && (
                      <span className="form-error">{errors.departureDate}</span>
                    )}
                  </div>
                </div>

                <div className="col-6">
                  <div className="form-group">
                    <label htmlFor="departureTime" className="form-label">
                      Departure Time *
                    </label>
                    <input
                      type="time"
                      id="departureTime"
                      name="departureTime"
                      value={formData.departureTime}
                      onChange={handleChange}
                      className={`form-control ${errors.departureTime ? 'error' : ''}`}
                      disabled={loading}
                    />
                    {errors.departureTime && (
                      <span className="form-error">{errors.departureTime}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-6">
                  <div className="form-group">
                    <label htmlFor="seatsAvailable" className="form-label">
                      Available Seats *
                    </label>
                    <select
                      id="seatsAvailable"
                      name="seatsAvailable"
                      value={formData.seatsAvailable}
                      onChange={handleChange}
                      className={`form-control ${errors.seatsAvailable ? 'error' : ''}`}
                      disabled={loading}
                    >
                      {[1,2,3,4,5,6,7,8].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                    {errors.seatsAvailable && (
                      <span className="form-error">{errors.seatsAvailable}</span>
                    )}
                  </div>
                </div>

                <div className="col-6">
                  <div className="form-group">
                    <label htmlFor="price" className="form-label">
                      Price per Person (₹) *
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className={`form-control ${errors.price ? 'error' : ''}`}
                      placeholder="e.g. 500"
                      min="0"
                      disabled={loading}
                    />
                    {errors.price && (
                      <span className="form-error">{errors.price}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description" className="form-label">
                  Additional Notes
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Any additional information about the ride..."
                  rows="3"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-section">
              <h3>Vehicle Information</h3>

              <div className="row">
                <div className="col-6">
                  <div className="form-group">
                    <label htmlFor="vehicleInfo.make" className="form-label">
                      Vehicle Make
                    </label>
                    <input
                      type="text"
                      id="vehicleInfo.make"
                      name="vehicleInfo.make"
                      value={formData.vehicleInfo.make}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="e.g. Honda"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="col-6">
                  <div className="form-group">
                    <label htmlFor="vehicleInfo.model" className="form-label">
                      Vehicle Model
                    </label>
                    <input
                      type="text"
                      id="vehicleInfo.model"
                      name="vehicleInfo.model"
                      value={formData.vehicleInfo.model}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="e.g. City"
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-6">
                  <div className="form-group">
                    <label htmlFor="vehicleInfo.color" className="form-label">
                      Vehicle Color
                    </label>
                    <input
                      type="text"
                      id="vehicleInfo.color"
                      name="vehicleInfo.color"
                      value={formData.vehicleInfo.color}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="e.g. White"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="col-6">
                  <div className="form-group">
                    <label htmlFor="vehicleInfo.licensePlate" className="form-label">
                      License Plate
                    </label>
                    <input
                      type="text"
                      id="vehicleInfo.licensePlate"
                      name="vehicleInfo.licensePlate"
                      value={formData.vehicleInfo.licensePlate}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="e.g. MH01AB1234"
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Preferences</h3>

              <div className="preferences-grid">
                <div className="form-check">
                  <input
                    type="checkbox"
                    id="preferences.smokingAllowed"
                    name="preferences.smokingAllowed"
                    checked={formData.preferences.smokingAllowed}
                    onChange={handleChange}
                    className="form-check-input"
                    disabled={loading}
                  />
                  <label htmlFor="preferences.smokingAllowed" className="form-check-label">
                    Smoking Allowed
                  </label>
                </div>

                <div className="form-check">
                  <input
                    type="checkbox"
                    id="preferences.petsAllowed"
                    name="preferences.petsAllowed"
                    checked={formData.preferences.petsAllowed}
                    onChange={handleChange}
                    className="form-check-input"
                    disabled={loading}
                  />
                  <label htmlFor="preferences.petsAllowed" className="form-check-label">
                    Pets Allowed
                  </label>
                </div>

                <div className="form-check">
                  <input
                    type="checkbox"
                    id="preferences.musicOk"
                    name="preferences.musicOk"
                    checked={formData.preferences.musicOk}
                    onChange={handleChange}
                    className="form-check-input"
                    disabled={loading}
                  />
                  <label htmlFor="preferences.musicOk" className="form-check-label">
                    Music OK
                  </label>
                </div>

                <div className="form-check">
                  <input
                    type="checkbox"
                    id="preferences.chatty"
                    name="preferences.chatty"
                    checked={formData.preferences.chatty}
                    onChange={handleChange}
                    className="form-check-input"
                    disabled={loading}
                  />
                  <label htmlFor="preferences.chatty" className="form-check-label">
                    Happy to Chat
                  </label>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={loading}
              >
                {loading ? 'Posting Ride...' : 'Post Ride'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostRide;