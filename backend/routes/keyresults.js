const express = require('express');
const router = express.Router();
const db = require('../models/db');

// Get all key results for an objective
router.get('/objective/:objectiveId', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM keyresults WHERE objective_id = $1', [req.params.objectiveId]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Create a key result for an objective
router.post('/objective/:objectiveId', async (req, res) => {
  const { title, progress } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO keyresults (title, progress, objective_id) VALUES ($1, $2, $3) RETURNING *',
      [title, progress, req.params.objectiveId]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update a key result
router.put('/:id', async (req, res) => {
  const { title, progress } = req.body;
  try {
    const result = await db.query(
      'UPDATE keyresults SET title = $1, progress = $2 WHERE id = $3 RETURNING *',
      [title, progress, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Key result not found' });
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a key result
router.delete('/:id', async (req, res) => {
  try {
    const result = await db.query('DELETE FROM keyresults WHERE id = $1', [req.params.id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Key result not found' });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
