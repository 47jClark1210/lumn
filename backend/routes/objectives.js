const express = require('express');
const router = express.Router();
const db = require('../models/db');

// Get all objectives with pagination
router.get('/', async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Default to page 1, 10 items per page
  const offset = (page - 1) * limit;

  try {
    const result = await db.query('SELECT * FROM objectives LIMIT $1 OFFSET $2', [limit, offset]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Get a specific objective
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid objective ID' });
  }

  try {
    const result = await db.query('SELECT * FROM objectives WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Objective not found' });
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Create a new objective
router.post('/', async (req, res) => {
  const { title, description, user_id, team_id } = req.body;

  if (!title || !description || !user_id || !team_id) {
    return res.status(400).json({ error: 'Title, description, user_id, and team_id are required' });
  }

  try {
    const result = await db.query(
      'INSERT INTO objectives (title, description, user_id, team_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, description, user_id, team_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    if (error.code === '23503') { // Foreign key violation
      res.status(400).json({ error: 'Invalid foreign key reference' });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});

// Update an objective
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid objective ID' });
  }
  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description are required' });
  }

  try {
    const result = await db.query(
      'UPDATE objectives SET title = $1, description = $2 WHERE id = $3 RETURNING *',
      [title, description, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Objective not found' });
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete an objective
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid objective ID' });
  }

  try {
    const result = await db.query('DELETE FROM objectives WHERE id = $1', [id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Objective not found' });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create a comment for an objective
router.post('/objective/:objectiveId', async (req, res) => {
  const { objectiveId } = req.params;
  const { text, user_id } = req.body;

  if (isNaN(objectiveId)) {
    return res.status(400).json({ error: 'Invalid objective ID' });
  }
  if (!text || !user_id) {
    return res.status(400).json({ error: 'Text and user_id are required' });
  }

  try {
    const result = await db.query(
      'INSERT INTO comments (text, user_id, objective_id) VALUES ($1, $2, $3) RETURNING *',
      [text, user_id, objectiveId]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    if (error.code === '23503') { // Foreign key violation
      res.status(400).json({ error: 'Invalid foreign key reference' });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});

module.exports = router;
