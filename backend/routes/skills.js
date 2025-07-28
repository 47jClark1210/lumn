const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');
const requireRole = require('../middleware/requireRole');
const skillService = require('../services/skillService');

// Get all skills
router.get('/', requireAuth, async (req, res) => {
  try {
    const skills = await skillService.getAllSkills();
    res.json(skills);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Add a new skill (admin only)
router.post('/', requireAuth, requireRole('admin', 'super_admin', 'org_admin'), async (req, res) => {
  const { name, description } = req.body;
  try {
    const skill = await skillService.addSkill({ name, description });
    res.status(201).json(skill);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update a skill (admin only)
router.put('/:id', requireAuth, requireRole('admin', 'super_admin', 'org_admin'), async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    const skill = await skillService.updateSkill(id, { name, description });
    res.json(skill);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a skill (admin only)
router.delete('/:id', requireAuth, requireRole('admin', 'super_admin', 'org_admin'), async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await skillService.deleteSkill(id);
    if (deleted === 0) {
      return res.status(404).json({ error: 'Skill not found' });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;