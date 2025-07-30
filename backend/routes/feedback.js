const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');
const feedbackService = require('../services/feedbackService');

// Add feedback or reflection for a learning module
router.post('/', requireAuth, async (req, res) => {
  const { moduleId, comment, rating } = req.body;
  const userId = req.user.id;
  try {
    const feedback = await feedbackService.addFeedback({
      userId,
      moduleId,
      comment,
      rating,
    });
    res.status(201).json(feedback);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get feedback for a learning module
router.get('/module/:moduleId', requireAuth, async (req, res) => {
  const { moduleId } = req.params;
  try {
    const feedbackList = await feedbackService.getModuleFeedback(moduleId);
    res.json(feedbackList);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get feedback by user
router.get('/user/:userId', requireAuth, async (req, res) => {
  const { userId } = req.params;
  try {
    const feedbackList = await feedbackService.getUserFeedback(userId);
    res.json(feedbackList);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
