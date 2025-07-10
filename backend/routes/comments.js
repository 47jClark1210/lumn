const express = require('express');
const router = express.Router();
const db = require('../models/db');

// Add a comment to an objective
router.post('/objective/:objectiveId', async (req, res) => {
  const { text, user_id } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO comments (text, user_id, objective_id) VALUES ($1, $2, $3) RETURNING *',
      [text, user_id, req.params.objectiveId]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get comments for an objective
router.get('/objective/:objectiveId', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM comments WHERE objective_id = $1', [req.params.objectiveId]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
