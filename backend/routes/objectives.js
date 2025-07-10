const express = require('express');
const router = express.Router();
const db = require('../models/db');

// Get all objectives
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM objectives');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Get a specific objective
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM objectives WHERE id = $1', [req.params.id]);
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
  try {
    const result = await db.query(
      'INSERT INTO objectives (title, description, user_id, team_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, description, user_id, team_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update an objective
router.put('/:id', async (req, res) => {
  const { title, description } = req.body;
  try {
    const result = await db.query(
      'UPDATE objectives SET title = $1, description = $2 WHERE id = $3 RETURNING *',
      [title, description, req.params.id]
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
  try {
    const result = await db.query('DELETE FROM objectives WHERE id = $1', [req.params.id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Objective not found' });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
