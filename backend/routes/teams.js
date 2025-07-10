const express = require('express');
const router = express.Router();
const db = require('../models/db');

// Get all teams
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM teams');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Create a new team
router.post('/', async (req, res) => {
  const { name } = req.body;
  try {
    const result = await db.query('INSERT INTO teams (name) VALUES ($1) RETURNING *', [name]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update a team
router.put('/:id', async (req, res) => {
  const { name } = req.body;
  try {
    const result = await db.query('UPDATE teams SET name = $1 WHERE id = $2 RETURNING *', [name, req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Team not found' });
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a team
router.delete('/:id', async (req, res) => {
  try {
    const result = await db.query('DELETE FROM teams WHERE id = $1', [req.params.id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Team not found' });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
