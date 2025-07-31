const db = require('../models/db');
const bcrypt = require('bcryptjs');

async function findUserById(id) {
  const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows[0];
}

async function findUserByEmail(email) {
  const result = await db.query('SELECT * FROM users WHERE email = $1', [
    email,
  ]);
  return result.rows[0];
}

async function getAllUsers() {
  const result = await db.query('SELECT * FROM users');
  return result.rows;
}

async function createUser({ name, email, role_id, team_id, password }) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await db.query(
    'INSERT INTO users (name, email, role_id, team_id, password) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [name, email, role_id, team_id, hashedPassword],
  );
  return result.rows[0];
}

async function updateUser(id, { name, email, role_id, team_id }) {
  const result = await db.query(
    'UPDATE users SET name = $1, email = $2, role_id = $3, team_id = $4 WHERE id = $5 RETURNING *',
    [name, email, role_id, team_id, id],
  );
  return result.rows[0];
}

async function deleteUser(id) {
  const result = await db.query('DELETE FROM users WHERE id = $1', [id]);
  return result.rowCount;
}

async function updateProfile(id, { name, email, team_id }) {
  const fields = [];
  const values = [];
  let idx = 1;
  if (name) {
    fields.push(`name = $${idx++}`);
    values.push(name);
  }
  if (email) {
    fields.push(`email = $${idx++}`);
    values.push(email);
  }
  if (team_id) {
    fields.push(`team_id = $${idx++}`);
    values.push(team_id);
  }
  values.push(id);

  const result = await db.query(
    `UPDATE users SET ${fields.join(', ')} WHERE id = $${idx} RETURNING id, name, email, role_id, team_id`,
    values,
  );
  return result.rows[0];
}

async function updateAvatar(id, avatarUrl) {
  await db.query('UPDATE users SET avatar_url = $1 WHERE id = $2', [
    avatarUrl,
    id,
  ]);
  return avatarUrl;
}

async function changePassword(id, oldPassword, newPassword) {
  const userResult = await db.query(
    'SELECT password FROM users WHERE id = $1',
    [id],
  );
  if (userResult.rows.length === 0) return false;
  const valid = await bcrypt.compare(oldPassword, userResult.rows[0].password);
  if (!valid) return false;
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await db.query('UPDATE users SET password = $1 WHERE id = $2', [
    hashedPassword,
    id,
  ]);
  return true;
}

module.exports = {
  findUserById,
  findUserByEmail,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  updateProfile,
  updateAvatar,
  changePassword,
};
