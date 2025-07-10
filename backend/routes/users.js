const express = require('express');
const router = express.Router();
const db = require('../models/db');

// Example in-memory data (for reference/testing)
let data = [
  { id: 1, name: 'John Doe', team: ['1898 & Co', 'Safety', 'Travel'], manager: 'Cris Underwood' },
  { id: 2, name: 'Jane Smith', team: 'HR', manager: 'Todd Schutes' }
];

// Get all users from database
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM users'); // Adjust as per your schema
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Create a new user in the database
router.post('/', async (req, res) => {
  if (!req.body || !req.body.name || !req.body.team) {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  const { name, team } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO users (name, team) VALUES ($1, $2) RETURNING *',
      [name, team]
    );
    res.status(201).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create resource (in-memory, for testing)
router.post('/test', (req, res) => {
  const newData = req.body;
  console.log('Received data:', newData);
  res.status(201).json({ message: 'Resource created successfully', data: newData });
});

// Update user in the database
router.put('/:id', async (req, res) => {
  if (!req.body || !req.body.name || !req.body.team) {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  const userId = req.params.id;
  const { name, team } = req.body;
  try {
    const result = await db.query(
      'UPDATE users SET name = $1, team = $2 WHERE id = $3 RETURNING *',
      [name, team, userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  const userId = req.params.id; // Get the user ID from the URL parameters
  try {
    const result = await db.query('DELETE FROM users WHERE id = $1', [userId]);
    if (result.rowCount === 0) {
      res.status(404).json({ error: 'User not found' }); // No user found with the given ID
    } else {
      res.status(204).send(); // User successfully deleted
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
