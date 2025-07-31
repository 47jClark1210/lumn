const db = require('../models/db');

// Add feedback or reflection for a learning module
async function addFeedback({ userId, moduleId, comment, rating }) {
  const result = await db.query(
    `INSERT INTO learning_feedback (user_id, module_id, comment, rating)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [userId, moduleId, comment, rating],
  );
  return result.rows[0];
}

// Get all feedback for a learning module
async function getModuleFeedback(moduleId) {
  const result = await db.query(
    `SELECT lf.*, u.name AS user_name
     FROM learning_feedback lf
     JOIN users u ON lf.user_id = u.id
     WHERE lf.module_id = $1
     ORDER BY lf.created_at DESC`,
    [moduleId],
  );
  return result.rows;
}

// Get all feedback by a user
async function getUserFeedback(userId) {
  const result = await db.query(
    `SELECT lf.*, m.title AS module_title
     FROM learning_feedback lf
     JOIN learning_modules m ON lf.module_id = m.id
     WHERE lf.user_id = $1
     ORDER BY lf.created_at DESC`,
    [userId],
  );
  return result.rows;
}

module.exports = {
  addFeedback,
  getModuleFeedback,
  getUserFeedback,
};
