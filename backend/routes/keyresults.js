const express = require('express');
const router = express.Router();
const db = require('../models/db');
const logger = require('../utils/logger');
const requireAuth = require('../middleware/requireAuth');
const requireRole = require('../middleware/requireRole');

// Get all key results for an OKR with pagination (authenticated users)
router.get('/okr/:okrId', requireAuth, async (req, res) => {
  const { okrId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  if (isNaN(okrId)) {
    return res.status(400).json({ error: 'Invalid OKR ID' });
  }

  try {
    const result = await db.query(
      'SELECT * FROM key_results WHERE okr_id = $1 LIMIT $2 OFFSET $3',
      [okrId, limit, offset],
    );
    res.json(result.rows);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create a key result for an OKR (super_admin, org_admin, team_lead)
router.post(
  '/okr/:okrId',
  requireAuth,
  requireRole('super_admin', 'org_admin', 'team_lead'),
  async (req, res) => {
    const { okrId } = req.params;
    const { title, progress } = req.body;

    if (isNaN(okrId)) {
      return res.status(400).json({ error: 'Invalid OKR ID' });
    }
    if (!title || progress === undefined) {
      return res.status(400).json({ error: 'Title and progress are required' });
    }

    try {
      const result = await db.query(
        'INSERT INTO key_results (title, progress, okr_id) VALUES ($1, $2, $3) RETURNING *',
        [title, progress, okrId],
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      logger.error(error);
      if (error.code === '23503') {
        // Foreign key violation
        res.status(400).json({ error: 'Invalid OKR ID reference' });
      } else {
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  },
);

// Update a key result (super_admin, org_admin, team_lead)
router.put(
  '/:id',
  requireAuth,
  requireRole('super_admin', 'org_admin', 'team_lead'),
  async (req, res) => {
    const { id } = req.params;
    const { title, progress } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid key result ID' });
    }
    if (!title || progress === undefined) {
      return res.status(400).json({ error: 'Title and progress are required' });
    }

    try {
      const result = await db.query(
        'UPDATE key_results SET title = $1, progress = $2 WHERE id = $3 RETURNING *',
        [title, progress, id],
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Key result not found' });
      }
      res.json(result.rows[0]);
    } catch (error) {
      logger.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
);

// Delete a key result (super_admin, org_admin, team_lead)
router.delete(
  '/:id',
  requireAuth,
  requireRole('super_admin', 'org_admin', 'team_lead'),
  async (req, res) => {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid key result ID' });
    }

    try {
      const result = await db.query('DELETE FROM key_results WHERE id = $1', [
        id,
      ]);
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Key result not found' });
      }
      res.status(204).send();
    } catch (error) {
      logger.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
);

module.exports = router;
