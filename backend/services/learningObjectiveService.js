const db = require('../models/db');

// Get all learning objectives (with optional filters)
async function getObjectives({ userId, teamId, okrId }) {
  let query = 'SELECT * FROM learning_objectives WHERE 1=1';
  const params = [];
  let idx = 1;

  if (userId) {
    query += ` AND user_id = $${idx++}`;
    params.push(userId);
  }
  if (teamId) {
    query += ` AND team_id = $${idx++}`;
    params.push(teamId);
  }
  if (okrId) {
    query += ` AND okr_id = $${idx++}`;
    params.push(okrId);
  }
  query += ' ORDER BY start_date DESC';

  const result = await db.query(query, params);
  return result.rows;
}

// Get a single learning objective by ID
async function getObjectiveById(id) {
  const result = await db.query('SELECT * FROM learning_objectives WHERE id = $1', [id]);
  return result.rows[0];
}

// Create a new learning objective
async function createObjective({ user_id, okr_id, team_id, title, description, start_date, end_date }) {
  const result = await db.query(
    `INSERT INTO learning_objectives (user_id, okr_id, team_id, title, description, start_date, end_date)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [user_id, okr_id, team_id, title, description, start_date, end_date]
  );
  return result.rows[0];
}

// Update a learning objective
async function updateObjective(id, { title, description, start_date, end_date, status }) {
  const result = await db.query(
    `UPDATE learning_objectives
     SET title = $1, description = $2, start_date = $3, end_date = $4, status = $5
     WHERE id = $6 RETURNING *`,
    [title, description, start_date, end_date, status, id]
  );
  return result.rows[0];
}

// Delete a learning objective
async function deleteObjective(id) {
  const result = await db.query('DELETE FROM learning_objectives WHERE id = $1', [id]);
  return result.rowCount;
}

module.exports = {
  getObjectives,
  getObjectiveById,
  createObjective,
  updateObjective,
  deleteObjective
};