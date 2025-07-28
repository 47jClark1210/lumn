const db = require('../models/db');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

async function findUserByEmail(email) {
  const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
}

async function validatePassword(user, password) {
  return await bcrypt.compare(password, user.password);
}

async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

async function setResetToken(email) {
  const token = crypto.randomBytes(32).toString('hex');
  const expiry = new Date(Date.now() + 3600 * 1000); // 1 hour
  await db.query(
    'UPDATE users SET reset_token = $1, reset_token_expiry = $2 WHERE email = $3',
    [token, expiry, email]
  );
  return { token, expiry };
}

async function findUserByResetToken(token) {
  const result = await db.query(
    'SELECT * FROM users WHERE reset_token = $1 AND reset_token_expiry > NOW()',
    [token]
  );
  return result.rows[0];
}

async function resetPassword(token, newPassword) {
  const hashedPassword = await hashPassword(newPassword);
  await db.query(
    'UPDATE users SET password = $1, reset_token = NULL, reset_token_expiry = NULL WHERE reset_token = $2',
    [hashedPassword, token]
  );
}

async function createUser({ name, email, password }) {
  const hashedPassword = await hashPassword(password);
  await db.query(
    'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)',
    [name, email, hashedPassword]
  );
}

async function setVerificationToken(email) {
  const verificationToken = crypto.randomBytes(32).toString('hex');
  await db.query(
    'UPDATE users SET verification_token = $1 WHERE email = $2',
    [verificationToken, email]
  );
  return verificationToken;
}

async function verifyEmail(token) {
  await db.query(
    'UPDATE users SET email_verified = TRUE, verification_token = NULL WHERE verification_token = $1',
    [token]
  );
}

async function findUserByVerificationToken(token) {
  const result = await db.query(
    'SELECT * FROM users WHERE verification_token = $1',
    [token]
  );
  return result.rows[0];
}

module.exports = {
  findUserByEmail,
  validatePassword,
  hashPassword,
  setResetToken,
  findUserByResetToken,
  resetPassword,
  createUser,
  setVerificationToken,
  verifyEmail,
  findUserByVerificationToken
};