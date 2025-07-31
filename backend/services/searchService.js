// Centralized search service for easy future replacement
const db = require('../models/db');

/**
 * Search across users, okrs, modules, and skills.
 * @param {string} term - The search term.
 * @returns {Promise<Object>} - Results grouped by entity type.
 */
async function search(term) {
  const likeTerm = `%${term}%`;
  // Users
  const users = await db.query(
    'SELECT id, name, email FROM users WHERE name ILIKE $1 OR email ILIKE $1',
    [likeTerm],
  );
  // OKRs
  const okrs = await db.query(
    'SELECT id, title, description FROM okrs WHERE title ILIKE $1 OR description ILIKE $1',
    [likeTerm],
  );
  // Modules
  const modules = await db.query(
    'SELECT id, title, description FROM modules WHERE title ILIKE $1 OR description ILIKE $1',
    [likeTerm],
  );
  // Skills
  const skills = await db.query(
    'SELECT id, name, description FROM skills WHERE name ILIKE $1 OR description ILIKE $1',
    [likeTerm],
  );
  return {
    users: users.rows,
    okrs: okrs.rows,
    modules: modules.rows,
    skills: skills.rows,
  };
}

module.exports = { search };
