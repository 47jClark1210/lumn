const db = require('../models/db');

async function getAllOKRs() {
  const result = await db.query('SELECT * FROM okrs');
  return result.rows;
}

async function createOKR({ title, description }) {
  const result = await db.query(
    'INSERT INTO okrs (title, description) VALUES ($1, $2) RETURNING *',
    [title, description || null],
  );
  return result.rows[0];
}

async function updateOKR(id, { title, description }) {
  const result = await db.query(
    'UPDATE okrs SET title = $1, description = $2 WHERE id = $3 RETURNING *',
    [title, description || null, id],
  );
  return result.rows[0];
}

async function deleteOKR(id) {
  const result = await db.query('DELETE FROM okrs WHERE id = $1', [id]);
  return result.rowCount;
}

module.exports = {
  getAllOKRs,
  createOKR,
  updateOKR,
  deleteOKR,
};
