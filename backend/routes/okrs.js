const express = require('express');
const router = express.Router();
const db = require('../models/db');
const requireAuth = require('../middleware/requireAuth');
const requireRole = require('../middleware/requireRole');
const logger = require('../utils/logger');

// GET OKRs based on user role
router.get('/', requireAuth, async (req, res) => {
  const { id: userId, role } = req.user;

  try {
    let result;
    switch (role) {
      case 'super_admin':
        result = await db.query('SELECT * FROM view_okrs_super_admin');
        break;
      case 'org_admin':
        result = await db.query(
          'SELECT * FROM view_okrs_org_admin WHERE org_id = (SELECT org_id FROM users WHERE id = $1)',
          [userId]
        );
        break;
      case 'team_lead':
        result = await db.query(
          'SELECT * FROM view_okrs_team_lead WHERE team_id = (SELECT team_id FROM users WHERE id = $1)',
          [userId]
        );
        break;
      case 'contributor':
        result = await db.query(
          'SELECT * FROM view_okrs_contributor WHERE owner_id = $1',
          [userId]
        );
        break;
      case 'viewer':
        result = await db.query(
          'SELECT * FROM view_okrs_viewer WHERE team_id = (SELECT team_id FROM users WHERE id = $1)',
          [userId]
        );
        break;
      default:
        return res.status(403).json({ error: 'Unauthorized role' });
    }
    res.json(result.rows);
    logger.info(`Fetched OKRs for user ${userId} with role ${role}`);
  } catch (err) {
    logger.error('Error fetching OKRs:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a new OKR (super_admin, org_admin, team_lead)
router.post(
  '/',
  requireAuth,
  requireRole('super_admin', 'org_admin', 'team_lead'),
  async (req, res) => {
    const { title, description, owner_id, team_id, org_id, status } = req.body;
    if (!title || !owner_id || !team_id || !org_id) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    try {
      const result = await db.query(
        'INSERT INTO okrs (title, description, owner_id, team_id, org_id, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [title, description || '', owner_id, team_id, org_id, status || 'Active']
      );
      res.status(201).json(result.rows[0]);
      logger.info(`Created OKR: ${title}`);
    } catch (err) {
      logger.error('Error creating OKR:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Update an OKR (super_admin, org_admin, team_lead)
router.put(
  '/:id',
  requireAuth,
  requireRole('super_admin', 'org_admin', 'team_lead'),
  async (req, res) => {
    const { id } = req.params;
    const { title, description, owner_id, team_id, org_id, status } = req.body;
    if (isNaN(id) || !title || !owner_id || !team_id || !org_id) {
      return res.status(400).json({ error: 'Missing or invalid fields' });
    }
    try {
      const result = await db.query(
        'UPDATE okrs SET title = $1, description = $2, owner_id = $3, team_id = $4, org_id = $5, status = $6 WHERE id = $7 RETURNING *',
        [title, description || '', owner_id, team_id, org_id, status || 'Active', id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'OKR not found' });
      }
      res.json(result.rows[0]);
      logger.info(`Updated OKR ID ${id}`);
    } catch (err) {
      logger.error('Error updating OKR:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Delete an OKR (super_admin, org_admin)
router.delete(
  '/:id',
  requireAuth,
  requireRole('super_admin', 'org_admin'),
  async (req, res) => {
    const { id } = req.params;
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid OKR ID' });
    }
    try {
      const result = await db.query('DELETE FROM okrs WHERE id = $1', [id]);
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'OKR not found' });
      }
      res.status(204).send();
      logger.info(`Deleted OKR ID ${id}`);
    } catch (err) {
      logger.error('Error deleting OKR:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

module.exports = router;