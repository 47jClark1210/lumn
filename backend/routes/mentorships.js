const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');
const mentorshipService = require('../services/mentorshipService');

// Create a mentorship relationship (admin only)
router.post('/', requireAuth, async (req, res) => {
  const { mentorId, menteeId, startDate, endDate } = req.body;
  try {
    const mentorship = await mentorshipService.createMentorship({ mentorId, menteeId, startDate, endDate });
    res.status(201).json(mentorship);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all mentorships for a user
router.get('/user/:userId', requireAuth, async (req, res) => {
  const { userId } = req.params;
  try {
    const mentorships = await mentorshipService.getUserMentorships(userId);
    res.json(mentorships);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// End a mentorship relationship
router.put('/:id/end', requireAuth, async (req, res) => {
  const { id } = req.params;
  try {
    const mentorship = await mentorshipService.endMentorship(id);
    res.json(mentorship);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;