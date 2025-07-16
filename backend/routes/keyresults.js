const express = require('express');
const router = express.Router();
const db = require('../models/db');

// Get all key results for an objective with pagination
router.get('/objective/:objectiveId', async (req, res) => {
  const { objectiveId } = req.params;
  const { page = 1, limit = 10 } = req.query; // Default to page 1, 10 items per page
  const offset = (page - 1) * limit;

  if (isNaN(objectiveId)) {
    return res.status(400).json({ error: 'Invalid objective ID' });
  }

  try {
    const result = await db.query(
      'SELECT * FROM keyresults WHERE objective_id = $1 LIMIT $2 OFFSET $3',
      [objectiveId, limit, offset]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create a key result for an objective
router.post('/objective/:objectiveId', async (req, res) => {
  const { objectiveId } = req.params;
  const { title, progress } = req.body;

  if (isNaN(objectiveId)) {
    return res.status(400).json({ error: 'Invalid objective ID' });
  }
  if (!title || progress === undefined) {
    return res.status(400).json({ error: 'Title and progress are required' });
  }

  try {
    const result = await db.query(
      'INSERT INTO keyresults (title, progress, objective_id) VALUES ($1, $2, $3) RETURNING *',
      [title, progress, objectiveId]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    if (error.code === '23503') { // Foreign key violation
      res.status(400).json({ error: 'Invalid objective ID reference' });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});

// Update a key result
router.put('/:id', async (req, res) => {
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
      'UPDATE keyresults SET title = $1, progress = $2 WHERE id = $3 RETURNING *',
      [title, progress, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Key result not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a key result
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid key result ID' });
  }

  try {
    const result = await db.query('DELETE FROM keyresults WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Key result not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
