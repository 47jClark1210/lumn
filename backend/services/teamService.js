const db = require('../models/db');

async function getAllTeams() {
  const result = await db.query('SELECT * FROM teams');
  return result.rows;
}

async function createTeam({ name, org_id, summary }) {
  const result = await db.query(
    'INSERT INTO teams (name, org_id, summary) VALUES ($1, $2, $3) RETURNING *',
    [name, org_id || null, summary || null],
  );
  return result.rows[0];
}

async function updateTeam(id, { name, org_id, summary }) {
  const result = await db.query(
    'UPDATE teams SET name = $1, org_id = $2, summary = $3 WHERE id = $4 RETURNING *',
    [name, org_id || null, summary || null, id],
  );
  return result.rows[0];
}

async function deleteTeam(id) {
  const result = await db.query('DELETE FROM teams WHERE id = $1', [id]);
  return result.rowCount;
}

module.exports = {
  getAllTeams,
  createTeam,
  updateTeam,
  deleteTeam,
};
