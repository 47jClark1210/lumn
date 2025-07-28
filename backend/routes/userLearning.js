const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');
const requireRole = require('../middleware/requireRole');
const userLearningService = require('../services/userLearningService');

// Assign a learning module to a user (admin only)
router.post('/assign', requireAuth, requireRole('admin', 'super_admin', 'org_admin'), async (req, res) => {
  const { userId, moduleId, assignedBy, assignedDate } = req.body;
  try {
    const assignment = await userLearningService.assignModule({ userId, moduleId, assignedBy, assignedDate });
    res.status(201).json(assignment);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Mark a module as completed by a user
router.put('/complete', requireAuth, async (req, res) => {
  const { userId, moduleId, completedDate } = req.body;
  try {
    const completion = await userLearningService.completeModule({ userId, moduleId, completedDate });
    res.json(completion);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all assigned modules for a user
router.get('/user/:userId', requireAuth, async (req, res) => {
  const { userId } = req.params;
  try {
    const modules = await userLearningService.getUserModules(userId);
    res.json(modules);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all users assigned to a module
router.get('/module/:moduleId', requireAuth, async (req, res) => {
  const { moduleId } = req.params;
  try {
    const users = await userLearningService.getModuleUsers(moduleId);
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;