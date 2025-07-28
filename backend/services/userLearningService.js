const db = require('../models/db');

// Assign a learning module to a user
async function assignModule({ userId, moduleId, assignedBy, assignedDate }) {
  const result = await db.query(
    `INSERT INTO user_learning (user_id, module_id, assigned_by, assigned_date, status)
     VALUES ($1, $2, $3, $4, 'assigned') RETURNING *`,
    [userId, moduleId, assignedBy, assignedDate]
  );
  return result.rows[0];
}

// Mark a module as completed by a user
async function completeModule({ userId, moduleId, completedDate }) {
  const result = await db.query(
    `UPDATE user_learning SET status = 'completed', completed_date = $1
     WHERE user_id = $2 AND module_id = $3 RETURNING *`,
    [completedDate, userId, moduleId]
  );
  return result.rows[0];
}

// Get all assigned modules for a user
async function getUserModules(userId) {
  const result = await db.query(
    `SELECT ul.*, m.title AS module_title, m.description
     FROM user_learning ul
     JOIN learning_modules m ON ul.module_id = m.id
     WHERE ul.user_id = $1
     ORDER BY ul.assigned_date DESC`,
    [userId]
  );
  return result.rows;
}

// Get all users assigned to a module
async function getModuleUsers(moduleId) {
  const result = await db.query(
    `SELECT ul.*, u.name AS user_name
     FROM user_learning ul
     JOIN users u ON ul.user_id = u.id
     WHERE ul.module_id = $1
     ORDER BY ul.assigned_date DESC`,
    [moduleId]
  );
  return result.rows;
}

module.exports = {
  assignModule,
  completeModule,
  getUserModules,
  getModuleUsers
};