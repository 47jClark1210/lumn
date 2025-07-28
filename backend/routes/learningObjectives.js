const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');
const requireRole = require('../middleware/requireRole');
const learningObjectiveService = require('../services/learningObjectiveService');

// Get all learning objectives (optionally filter by user, team, or OKR)
router.get('/', requireAuth, async (req, res) => {
  const { userId, teamId, okrId } = req.query;
  try {
    const objectives = await learningObjectiveService.getObjectives({ userId, teamId, okrId });
    res.json(objectives);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get a single learning objective
router.get('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  try {
    const objective = await learningObjectiveService.getObjectiveById(id);
    if (!objective) return res.status(404).json({ error: 'Objective not found' });
    res.json(objective);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a new learning objective (admin or self)
router.post('/', requireAuth, async (req, res) => {
  const { user_id, okr_id, team_id, title, description, start_date, end_date } = req.body;
  try {
    const objective = await learningObjectiveService.createObjective({
      user_id: user_id || req.user.id,
      okr_id,
      team_id,
      title,
      description,
      start_date,
      end_date
    });
    res.status(201).json(objective);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update a learning objective (admin or owner)
router.put('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const { title, description, start_date, end_date, status } = req.body;
  try {
    const objective = await learningObjectiveService.updateObjective(id, {
      title,
      description,
      start_date,
      end_date,
      status
    });
    res.json(objective);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a learning objective (admin or owner)
router.delete('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await learningObjectiveService.deleteObjective(id);
    if (deleted === 0) return res.status(404).json({ error: 'Objective not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;