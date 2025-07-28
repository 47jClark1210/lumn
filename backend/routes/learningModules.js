const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');
const requireRole = require('../middleware/requireRole');
const learningModuleService = require('../services/learningModuleService');

// Get all learning modules
router.get('/', requireAuth, async (req, res) => {
  try {
    const modules = await learningModuleService.getAllModules();
    res.json(modules);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get a single learning module
router.get('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  try {
    const module = await learningModuleService.getModuleById(id);
    if (!module) return res.status(404).json({ error: 'Module not found' });
    res.json(module);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a new learning module (admin only)
router.post('/', requireAuth, requireRole('admin', 'super_admin', 'org_admin'), async (req, res) => {
  const { title, description, resource_url, type, tags } = req.body;
  const createdBy = req.user.id;
  try {
    const module = await learningModuleService.createModule({ title, description, resource_url, type, tags, createdBy });
    res.status(201).json(module);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update a learning module (admin only)
router.put('/:id', requireAuth, requireRole('admin', 'super_admin', 'org_admin'), async (req, res) => {
  const { id } = req.params;
  const { title, description, resource_url, type, tags } = req.body;
  try {
    const module = await learningModuleService.updateModule(id, { title, description, resource_url, type, tags });
    res.json(module);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a learning module (admin only)
router.delete('/:id', requireAuth, requireRole('admin', 'super_admin', 'org_admin'), async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await learningModuleService.deleteModule(id);
    if (deleted === 0) return res.status(404).json({ error: 'Module not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;