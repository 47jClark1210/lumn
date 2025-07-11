const express = require('express');
const router = express.Router();
const db = require('../models/db');

// Add a comment to an objective
router.post('/objective/:objectiveId', async (req, res, next) => {
  const { objectiveId } = req.params;
  const { text, user_id } = req.body;

  if (isNaN(objectiveId)) {
    return next({ status: 400, message: 'Invalid objective ID' });
  }
  if (!text || !user_id) {
    return next({ status: 400, message: 'Text and user_id are required' });
  }

  try {
    const result = await db.query(
      'INSERT INTO comments (text, user_id, objective_id) VALUES ($1, $2, $3) RETURNING *',
      [text, user_id, objectiveId]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === '23503') { // Foreign key violation
      return next({ status: 400, message: 'Invalid foreign key reference' });
    }
    next(error); // Pass other errors to the global error handler
  }
});

// Get comments for an objective with pagination
router.get('/objective/:objectiveId', async (req, res) => {
  const { objectiveId } = req.params;
  const { page = 1, limit = 10 } = req.query; // Default to page 1, 10 items per page
  const offset = (page - 1) * limit;

  if (isNaN(objectiveId)) {
    return res.status(400).json({ error: 'Invalid objective ID' });
  }

  try {
    const result = await db.query(
      'SELECT * FROM comments WHERE objective_id = $1 LIMIT $2 OFFSET $3',
      [objectiveId, limit, offset]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
