const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

// @route   GET /api/users/stats
// @desc    Get platform statistics
// @access  Private
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ isActive: true });
    const totalDrivers = await User.countDocuments({ isActive: true, isDriver: true });

    res.json({
      success: true,
      data: {
        totalUsers,
        totalDrivers,
        verifiedUsers: totalUsers, // All users are verified by default now
        completedProfiles: await User.countDocuments({ 
          isActive: true, 
          isProfileComplete: true 
        })
      }
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get statistics'
    });
  }
});

module.exports = router;