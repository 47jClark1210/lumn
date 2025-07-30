const db = require('../models/db');

// Create a mentorship relationship
async function createMentorship({ mentorId, menteeId, startDate, endDate }) {
  const result = await db.query(
    `INSERT INTO mentorships (mentor_id, mentee_id, start_date, end_date, status)
     VALUES ($1, $2, $3, $4, 'active') RETURNING *`,
    [mentorId, menteeId, startDate, endDate],
  );
  return result.rows[0];
}

// Get all mentorships for a user (as mentor or mentee)
async function getUserMentorships(userId) {
  const result = await db.query(
    `SELECT m.*, mentor.name AS mentor_name, mentee.name AS mentee_name
     FROM mentorships m
     JOIN users mentor ON m.mentor_id = mentor.id
     JOIN users mentee ON m.mentee_id = mentee.id
     WHERE m.mentor_id = $1 OR m.mentee_id = $1
     ORDER BY m.start_date DESC`,
    [userId],
  );
  return result.rows;
}

// End a mentorship relationship
async function endMentorship(id) {
  const result = await db.query(
    `UPDATE mentorships SET status = 'ended', end_date = NOW() WHERE id = $1 RETURNING *`,
    [id],
  );
  return result.rows[0];
}

module.exports = {
  createMentorship,
  getUserMentorships,
  endMentorship,
};
