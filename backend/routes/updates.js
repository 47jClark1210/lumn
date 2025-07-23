const express = require('express');
const router = express.Router();
const db = require('../models/db');
const logger = require('../utils/logger');
const requireAuth = require('../middleware/requireAuth');
const requireRole = require('../middleware/requireRole');

// Get all updates for a specific OKR (authenticated users)
router.get('/okr/:okrId', requireAuth, async (req, res) => {
  const { okrId } = req.params;
  if (isNaN(okrId)) {
    return res.status(400).json({ error: 'Invalid OKR ID' });
  }
  try {
    const result = await db.query(
      `SELECT u.id, u.okr_id, u.user_id, u.text, u.created_at, users.name AS author
       FROM updates u
       JOIN users ON u.user_id = users.id
       WHERE u.okr_id = $1
       ORDER BY u.created_at DESC`,
      [okrId]
    );
    res.json(result.rows);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a new update for an OKR (authenticated users)
router.post('/okr/:okrId', requireAuth, async (req, res) => {
  const { okrId } = req.params;
  const { user_id, text } = req.body;
  if (isNaN(okrId) || isNaN(user_id) || !text) {
    return res.status(400).json({ error: 'Invalid input' });
  }
  try {
    const result = await db.query(
      `INSERT INTO updates (okr_id, user_id, text) VALUES ($1, $2, $3) RETURNING *`,
      [okrId, user_id, text]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update an existing update (authenticated users)
router.put('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  if (isNaN(id) || !text) {
    return res.status(400).json({ error: 'Invalid input' });
  }
  try {
    const result = await db.query(
      `UPDATE updates SET text = $1 WHERE id = $2 RETURNING *`,
      [text, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Update not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete an update (super_admin or org_admin only)
router.delete('/:id', requireAuth, requireRole('super_admin', 'org_admin'), async (req, res) => {
  const { id } = req.params;
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid update ID' });
  }
  try {
    const result = await db.query(
      `DELETE FROM updates WHERE id = $1`,
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Update not found' });
    }
    res.status(204).send();
  } catch (err) {
    logger.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
