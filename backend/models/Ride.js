const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  origin: {
    type: String,
    required: [true, 'Origin is required'],
    trim: true
  },
  destination: {
    type: String,
    required: [true, 'Destination is required'],
    trim: true
  },
  departureDate: {
    type: Date,
    required: [true, 'Departure date is required'],
    validate: {
      validator: function(v) {
        return v > new Date();
      },
      message: 'Departure date must be in the future'
    }
  },
  departureTime: {
    type: String,
    required: [true, 'Departure time is required']
  },
  seatsAvailable: {
    type: Number,
    required: [true, 'Number of seats is required'],
    min: [1, 'At least 1 seat must be available'],
    max: [8, 'Maximum 8 seats allowed']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  vehicleInfo: {
    make: String,
    model: String,
    color: String,
    licensePlate: String
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters'],
    default: ''
  },
  preferences: {
    smokingAllowed: { type: Boolean, default: false },
    petsAllowed: { type: Boolean, default: false },
    musicOk: { type: Boolean, default: true },
    chatty: { type: Boolean, default: true }
  },
  status: {
    type: String,
    enum: ['active', 'full', 'completed', 'cancelled'],
    default: 'active'
  },
  passengers: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'confirmed'
    }
  }],
  // For future use - route details
  route: {
    distance: Number,
    duration: Number,
    waypoints: [String]
  }
}, {
  timestamps: true
});

// Indexes for better query performance
rideSchema.index({ origin: 1, destination: 1 });
rideSchema.index({ departureDate: 1 });
rideSchema.index({ driver: 1 });
rideSchema.index({ status: 1 });
rideSchema.index({ createdAt: -1 });

// Virtual for available seats count
rideSchema.virtual('availableSeats').get(function() {
  const confirmedPassengers = this.passengers.filter(p => p.status === 'confirmed').length;
  return this.seatsAvailable - confirmedPassengers;
});

// Method to check if ride is full
rideSchema.methods.isFull = function() {
  const confirmedPassengers = this.passengers.filter(p => p.status === 'confirmed').length;
  return confirmedPassengers >= this.seatsAvailable;
};

// Update status based on passengers
rideSchema.pre('save', function(next) {
  if (this.isFull() && this.status === 'active') {
    this.status = 'full';
  } else if (!this.isFull() && this.status === 'full') {
    this.status = 'active';
  }
  next();
});

module.exports = mongoose.model('Ride', rideSchema);