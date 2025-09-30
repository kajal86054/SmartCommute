const express = require('express');
const router = express.Router();
const Ride = require('../models/Ride');
const { authenticateToken } = require('../middleware/auth');

// @route   POST /api/rides
// @desc    Create a new ride
// @access  Private
router.post('/', authenticateToken, async (req, res) => {
  try {
    const rideData = {
      ...req.body,
      driver: req.user._id
    };

    const ride = new Ride(rideData);
    await ride.save();

    // Populate driver info
    await ride.populate('driver', 'firstName lastName email phone vehicleInfo');

    res.status(201).json({
      success: true,
      message: 'Ride created successfully',
      data: ride
    });

  } catch (error) {
    console.error('Create ride error:', error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create ride'
    });
  }
});

// @route   GET /api/rides
// @desc    Get rides with optional filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { 
      origin, 
      destination, 
      date, 
      minSeats,
      maxPrice,
      page = 1,
      limit = 10
    } = req.query;

    // Build query
    const query = { status: { $in: ['active', 'full'] } };

    if (origin) {
      query.origin = new RegExp(origin, 'i');
    }

    if (destination) {
      query.destination = new RegExp(destination, 'i');
    }

    if (date) {
      const searchDate = new Date(date);
      const nextDay = new Date(searchDate);
      nextDay.setDate(nextDay.getDate() + 1);

      query.departureDate = {
        $gte: searchDate,
        $lt: nextDay
      };
    }

    if (minSeats) {
      query.seatsAvailable = { $gte: parseInt(minSeats) };
    }

    if (maxPrice) {
      query.price = { $lte: parseInt(maxPrice) };
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const rides = await Ride.find(query)
      .populate('driver', 'firstName lastName profilePicture trustScore totalRatings')
      .populate('passengers.user', 'firstName lastName')
      .sort({ departureDate: 1 })
      .limit(limitNum)
      .skip(skip);

    const total = await Ride.countDocuments(query);

    res.json({
      success: true,
      data: {
        rides,
        pagination: {
          current: pageNum,
          pages: Math.ceil(total / limitNum),
          total,
          hasMore: skip + rides.length < total
        }
      }
    });

  } catch (error) {
    console.error('Get rides error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch rides'
    });
  }
});

// @route   GET /api/rides/my
// @desc    Get current user's rides (as driver)
// @access  Private
router.get('/my', authenticateToken, async (req, res) => {
  try {
    const rides = await Ride.find({ driver: req.user._id })
      .populate('passengers.user', 'firstName lastName profilePicture')
      .sort({ departureDate: -1 });

    res.json({
      success: true,
      data: rides
    });

  } catch (error) {
    console.error('Get my rides error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch your rides'
    });
  }
});

// @route   GET /api/rides/joined
// @desc    Get rides where current user is a passenger
// @access  Private
router.get('/joined', authenticateToken, async (req, res) => {
  try {
    const rides = await Ride.find({
      'passengers.user': req.user._id,
      'passengers.status': 'confirmed'
    })
      .populate('driver', 'firstName lastName profilePicture trustScore')
      .sort({ departureDate: -1 });

    res.json({
      success: true,
      data: rides
    });

  } catch (error) {
    console.error('Get joined rides error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch joined rides'
    });
  }
});

// @route   POST /api/rides/:id/join
// @desc    Join a ride as passenger
// @access  Private
router.post('/:id/join', authenticateToken, async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found'
      });
    }

    if (ride.driver.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot join your own ride'
      });
    }

    // Check if user already joined
    const alreadyJoined = ride.passengers.some(
      p => p.user.toString() === req.user._id.toString()
    );

    if (alreadyJoined) {
      return res.status(409).json({
        success: false,
        message: 'You have already joined this ride'
      });
    }

    // Check if ride is full
    if (ride.isFull()) {
      return res.status(409).json({
        success: false,
        message: 'This ride is already full'
      });
    }

    // Add passenger
    ride.passengers.push({
      user: req.user._id,
      status: 'confirmed'
    });

    await ride.save();

    // Populate and return updated ride
    await ride.populate('driver', 'firstName lastName');
    await ride.populate('passengers.user', 'firstName lastName');

    res.json({
      success: true,
      message: 'Successfully joined the ride',
      data: ride
    });

  } catch (error) {
    console.error('Join ride error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to join ride'
    });
  }
});

// @route   DELETE /api/rides/:id/leave
// @desc    Leave a ride as passenger
// @access  Private
router.delete('/:id/leave', authenticateToken, async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found'
      });
    }

    // Remove passenger
    ride.passengers = ride.passengers.filter(
      p => p.user.toString() !== req.user._id.toString()
    );

    await ride.save();

    res.json({
      success: true,
      message: 'Successfully left the ride'
    });

  } catch (error) {
    console.error('Leave ride error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to leave ride'
    });
  }
});

// @route   GET /api/rides/:id
// @desc    Get single ride details
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id)
      .populate('driver', 'firstName lastName profilePicture trustScore totalRatings vehicleInfo')
      .populate('passengers.user', 'firstName lastName profilePicture');

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found'
      });
    }

    res.json({
      success: true,
      data: ride
    });

  } catch (error) {
    console.error('Get ride error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch ride details'
    });
  }
});

module.exports = router;