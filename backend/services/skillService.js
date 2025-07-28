const db = require('../models/db');

// Get all skills
async function getAllSkills() {
  const result = await db.query('SELECT * FROM skills ORDER BY name ASC');
  return result.rows;
}

// Add a new skill
async function addSkill({ name, description }) {
  const result = await db.query(
    'INSERT INTO skills (name, description) VALUES ($1, $2) RETURNING *',
    [name, description]
  );
  return result.rows[0];
}

// Update a skill
async function updateSkill(id, { name, description }) {
  const result = await db.query(
    'UPDATE skills SET name = $1, description = $2 WHERE id = $3 RETURNING *',
    [name, description, id]
  );
  return result.rows[0];
}

// Delete a skill
async function deleteSkill(id) {
  const result = await db.query('DELETE FROM skills WHERE id = $1', [id]);
  return result.rowCount;
}

module.exports = {
  getAllSkills,
  addSkill,
  updateSkill,
  deleteSkill
};