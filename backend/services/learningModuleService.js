const db = require('../models/db');

// Get all learning modules
async function getAllModules() {
  const result = await db.query('SELECT * FROM learning_modules ORDER BY created_by DESC, id DESC');
  return result.rows;
}

// Get a single learning module by ID
async function getModuleById(id) {
  const result = await db.query('SELECT * FROM learning_modules WHERE id = $1', [id]);
  return result.rows[0];
}

// Create a new learning module
async function createModule({ title, description, resource_url, type, tags, createdBy }) {
  const result = await db.query(
    `INSERT INTO learning_modules (title, description, resource_url, type, tags, created_by)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [title, description, resource_url, type, tags, createdBy]
  );
  return result.rows[0];
}

// Update a learning module
async function updateModule(id, { title, description, resource_url, type, tags }) {
  const result = await db.query(
    `UPDATE learning_modules
     SET title = $1, description = $2, resource_url = $3, type = $4, tags = $5
     WHERE id = $6 RETURNING *`,
    [title, description, resource_url, type, tags, id]
  );
  return result.rows[0];
}

// Delete a learning module
async function deleteModule(id) {
  const result = await db.query('DELETE FROM learning_modules WHERE id = $1', [id]);
  return result.rowCount;
}

module.exports = {
  getAllModules,
  getModuleById,
  createModule,
  updateModule,
    deleteModule
  }