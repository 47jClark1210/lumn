const express = require('express');
const router = express.Router();
const db = require('../models/db');
const logger = require('../utils/logger');
const requireAuth = require('../middleware/requireAuth');
const requireRole = require('../middleware/requireRole');

// Get all teams (authenticated users)
router.get('/', requireAuth, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM teams');
    res.json(result.rows);
    logger.info('Fetched all teams');
  } catch (err) {
    logger.error('Error fetching teams:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a new team (super_admin or org_admin only)
router.post(
  '/',
  requireAuth,
  requireRole('super_admin', 'org_admin'),
  async (req, res) => {
    const { name, org_id } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Team name is required' });
    }

    try {
      const result = await db.query(
        'INSERT INTO teams (name, org_id) VALUES ($1, $2) RETURNING *',
        [name, org_id || null],
      );
      res.status(201).json(result.rows[0]);
      logger.info(`Created new team: ${name}`);
    } catch (error) {
      logger.error(error);
      if (error.code === '23505') {
        // Unique constraint violation
        res.status(400).json({ error: 'Team name must be unique' });
      } else {
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  },
);

// Update a team (super_admin or org_admin only)
router.put(
  '/:id',
  requireAuth,
  requireRole('super_admin', 'org_admin'),
  async (req, res) => {
    const { id } = req.params;
    const { name, org_id } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid team ID' });
    }
    if (!name) {
      return res.status(400).json({ error: 'Team name is required' });
    }

    try {
      const result = await db.query(
        'UPDATE teams SET name = $1, org_id = $2 WHERE id = $3 RETURNING *',
        [name, org_id || null, id],
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Team not found' });
      }
      res.json(result.rows[0]);
      logger.info(`Updated team ID ${id}`);
    } catch (error) {
      logger.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
);

// Delete a team (super_admin only)
router.delete(
  '/:id',
  requireAuth,
  requireRole('super_admin'),
  async (req, res) => {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid team ID' });
    }

    try {
      const result = await db.query('DELETE FROM teams WHERE id = $1', [id]);
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Team not found' });
      }
      res.status(204).send();
      logger.info(`Deleted team ID ${id}`);
    } catch (error) {
      logger.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
);

module.exports = router;
