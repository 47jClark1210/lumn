const db = require('../models/db');

// Get all updates for a specific OKR
async function getOkrUpdatesReport(okrId) {
  const result = await db.query(
    `SELECT u.id, u.content, u.date, us.name AS author
     FROM updates u
     JOIN users us ON u.author_id = us.id
     WHERE u.okr_id = $1
     ORDER BY u.date DESC`,
    [okrId]
  );
  return result.rows;
}

// Get summary of updates for a team
async function getTeamUpdatesReport(teamId) {
  const result = await db.query(
    `SELECT t.name AS team_name, COUNT(u.id) AS updates_count
     FROM teams t
     LEFT JOIN users us ON us.team_id = t.id
     LEFT JOIN updates u ON u.author_id = us.id
     WHERE t.id = $1
     GROUP BY t.name`,
    [teamId]
  );
  return result.rows[0];
}

module.exports = {
  getOkrUpdatesReport,
  getTeamUpdatesReport,
  // ...other report functions...
};