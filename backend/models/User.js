const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  // Basic Information
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [30, 'First name cannot exceed 30 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [30, 'Last name cannot exceed 30 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  phone: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^[+]?[1-9][0-9]{9,14}$/.test(v);
      },
      message: 'Please provide a valid phone number'
    }
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  dateOfBirth: {
    type: Date,
    validate: {
      validator: function(v) {
        return !v || v < new Date();
      },
      message: 'Date of birth must be in the past'
    }
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other', 'Prefer not to say'],
    default: 'Prefer not to say'
  },

  // Profile Information
  profilePicture: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters'],
    default: ''
  },

  // Verification Status (simplified for now)
  isEmailVerified: {
    type: Boolean,
    default: true  // Always true for now
  },
  isPhoneVerified: {
    type: Boolean,
    default: true  // Always true for now
  },
  isProfileComplete: {
    type: Boolean,
    default: false
  },

  // Trust and Rating System
  trustScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalRatings: {
    type: Number,
    default: 0
  },
  ratingsBreakdown: {
    punctuality: { type: Number, default: 0 },
    communication: { type: Number, default: 0 },
    safety: { type: Number, default: 0 },
    reliability: { type: Number, default: 0 }
  },

  // Driver Information
  isDriver: {
    type: Boolean,
    default: false
  },
  vehicleInfo: {
    make: String,
    model: String,
    year: Number,
    color: String,
    licensePlate: String,
    seats: {
      type: Number,
      min: 1,
      max: 8
    }
  },

  // Preferences
  preferences: {
    smokingAllowed: {
      type: Boolean,
      default: false
    },
    petsAllowed: {
      type: Boolean,
      default: false
    },
    musicPreference: {
      type: String,
      enum: ['Any', 'No music', 'Soft music', 'Loud music'],
      default: 'Any'
    },
    talkingPreference: {
      type: String,
      enum: ['Chatty', 'Quiet', 'No preference'],
      default: 'No preference'
    }
  },

  // Emergency Contacts
  emergencyContacts: [{
    name: String,
    phone: String,
    relation: String
  }],

  // Account Status
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better query performance
userSchema.index({ email: 1 });
userSchema.index({ trustScore: -1 });
userSchema.index({ createdAt: -1 });

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to calculate profile completion percentage
userSchema.methods.getProfileCompletionPercentage = function() {
  let completed = 0;
  let total = 7; // Total fields to check

  if (this.firstName) completed++;
  if (this.lastName) completed++;
  if (this.email) completed++;
  if (this.dateOfBirth) completed++;
  if (this.profilePicture) completed++;
  if (this.bio) completed++;
  if (this.phone) completed++;

  return Math.round((completed / total) * 100);
};

module.exports = mongoose.model('User', userSchema);