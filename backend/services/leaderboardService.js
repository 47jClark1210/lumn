const db = require('../models/db');

// Get leaderboard for a specific team
async function getTeamLeaderboard(teamId) {
  const result = await db.query(
    `SELECT u.id AS user_id, u.name AS user_name, COUNT(ul.id) AS completed_modules
     FROM users u
     LEFT JOIN user_learning ul ON ul.user_id = u.id AND ul.status = 'completed'
     WHERE u.team_id = $1
     GROUP BY u.id, u.name
     ORDER BY completed_modules DESC`,
    [teamId]
  );
  return result.rows;
}

// Get global leaderboard (all teams)
async function getGlobalLeaderboard() {
  const result = await db.query(
    `SELECT t.id AS team_id, t.name AS team_name, COUNT(ul.id) AS completed_modules
     FROM teams t
     LEFT JOIN users u ON u.team_id = t.id
     LEFT JOIN user_learning ul ON ul.user_id = u.id AND ul.status = 'completed'
     GROUP BY t.id, t.name
     ORDER BY completed_modules DESC`
  );
  return result.rows;
}

module.exports = {
  getTeamLeaderboard,
  getGlobalLeaderboard
};