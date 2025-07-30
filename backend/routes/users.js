const express = require('express');
const router = express.Router();
const db = require('../models/db');
const logger = require('../utils/logger');
const requireAuth = require('../middleware/requireAuth');
const requireRole = require('../middleware/requireRole');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const { fileURLToPath } = require('url');
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configure Multer for avatar uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/avatars'));
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `user_${req.user.id}_${Date.now()}${path.extname(file.originalname)}`,
    );
  },
});
const upload = multer({ storage });

// Get all users (authenticated users only)
router.get('/', requireAuth, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM users');
    res.json(result.rows);
    logger.info('Fetched all users');
  } catch (err) {
    logger.error('Error fetching users:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a new user (super_admin or org_admin only)
router.post(
  '/',
  requireAuth,
  requireRole('super_admin', 'org_admin'),
  async (req, res) => {
    const { name, email, role_id, team_id, password } = req.body;
    if (!name || !email || !role_id || !team_id || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await db.query(
        'INSERT INTO users (name, email, role_id, team_id, password) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [name, email, role_id, team_id, hashedPassword],
      );
      res.status(201).json(result.rows[0]);
      logger.info(`Created user: ${name}`);
    } catch (error) {
      logger.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
);

// Update user (super_admin or org_admin only)
router.put(
  '/:id',
  requireAuth,
  requireRole('super_admin', 'org_admin'),
  async (req, res) => {
    const userId = req.params.id;
    const { name, email, role_id, team_id } = req.body;
    if (!name || !email || !role_id || !team_id) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    try {
      const result = await db.query(
        'UPDATE users SET name = $1, email = $2, role_id = $3, team_id = $4 WHERE id = $5 RETURNING *',
        [name, email, role_id, team_id, userId],
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json(result.rows[0]);
      logger.info(`Updated user ID ${userId}`);
    } catch (error) {
      logger.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
);

// Delete user (super_admin only)
router.delete(
  '/:id',
  requireAuth,
  requireRole('super_admin'),
  async (req, res) => {
    const userId = req.params.id;
    try {
      const result = await db.query('DELETE FROM users WHERE id = $1', [
        userId,
      ]);
      if (result.rowCount === 0) {
        res.status(404).json({ error: 'User not found' });
      } else {
        res.status(204).send();
        logger.info(`Deleted user ID ${userId}`);
      }
    } catch (error) {
      logger.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
);

// Get current user's profile
router.get('/me', requireAuth, async (req, res) => {
  const userId = req.user.id;
  try {
    const result = await db.query(
      'SELECT id, name, email, role_id, team_id FROM users WHERE id = $1',
      [userId],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    logger.error('Error fetching user profile:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update current user's profile (name, email, team)
router.put('/me', requireAuth, async (req, res) => {
  const userId = req.user.id;
  const { name, email, team_id } = req.body;
  if (!name && !email && !team_id) {
    return res.status(400).json({ error: 'No fields to update' });
  }
  // Build dynamic query
  const fields = [];
  const values = [];
  let idx = 1;
  if (name) {
    fields.push(`name = $${idx++}`);
    values.push(name);
  }
  if (email) {
    fields.push(`email = $${idx++}`);
    values.push(email);
  }
  if (team_id) {
    fields.push(`team_id = $${idx++}`);
    values.push(team_id);
  }
  values.push(userId);

  try {
    const result = await db.query(
      `UPDATE users SET ${fields.join(', ')} WHERE id = $${idx} RETURNING id, name, email, role_id, team_id`,
      values,
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    logger.error('Error updating user profile:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Avatar upload endpoint
router.post(
  '/me/avatar',
  requireAuth,
  upload.single('avatar'),
  async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    try {
      await db.query('UPDATE users SET avatar_url = $1 WHERE id = $2', [
        avatarUrl,
        req.user.id,
      ]);
      res.json({ avatar_url: avatarUrl });
    } catch (err) {
      logger.error('Error uploading avatar:', err);
      res.status(500).json({ error: 'Server error' });
    }
  },
);

// Change password
router.post('/me/change-password', requireAuth, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    return res.status(400).json({ error: 'Old and new password are required' });
  }
  try {
    const userResult = await db.query(
      'SELECT password FROM users WHERE id = $1',
      [req.user.id],
    );
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const valid = await bcrypt.compare(
      oldPassword,
      userResult.rows[0].password,
    );
    if (!valid) {
      return res.status(400).json({ error: 'Old password is incorrect' });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.query('UPDATE users SET password = $1 WHERE id = $2', [
      hashedPassword,
      req.user.id,
    ]);
    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    logger.error('Error changing password:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
