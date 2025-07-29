const express = require('express');
const router = express.Router();
const db = require('../models/db');
const requireAuth = require('../middleware/requireAuth');

// Utility: get unique values from array
function unique(arr) {
  return [...new Set(arr.filter((v) => v !== null && v !== undefined))];
}

// Utility: basic relevance score (more fields matched = higher score)
function getRelevanceScore(obj, q, fields) {
  let score = 0;
  for (const field of fields) {
    if (
      obj[field] &&
      typeof obj[field] === 'string' &&
      obj[field].toLowerCase().includes(q.toLowerCase())
    ) {
      score++;
    }
  }
  return score;
}

router.get('/', requireAuth, async (req, res) => {
  let { q, limit = 20, offset = 0 } = req.query;
  limit = Math.max(1, Math.min(parseInt(limit), 100));
  offset = Math.max(0, parseInt(offset));
  if (!q) return res.status(400).json({ error: 'Missing search query' });

  try {
    // Search users (select only needed fields)
    const usersResult = await db.query(
      `SELECT id, name, email, team_id FROM users WHERE name ILIKE $1 OR email ILIKE $1 LIMIT $2 OFFSET $3`,
      [`%${q}%`, limit, offset],
    );
    // Search teams
    const teamsResult = await db.query(
      `SELECT id, name FROM teams WHERE name ILIKE $1 LIMIT $2 OFFSET $3`,
      [`%${q}%`, limit, offset],
    );
    // Search okrs
    const okrsResult = await db.query(
      `SELECT id, title, description, owner_id, team_id FROM okrs WHERE title ILIKE $1 OR description ILIKE $1 LIMIT $2 OFFSET $3`,
      [`%${q}%`, limit, offset],
    );
    // Search keyresults
    const keyResultsResult = await db.query(
      `SELECT id, text, okr_id, owner_id, team_id FROM keyresults WHERE text ILIKE $1 LIMIT $2 OFFSET $3`,
      [`%${q}%`, limit, offset],
    );
    // Search updates
    const updatesResult = await db.query(
      `SELECT id, text, author_id, okr_id, team_id, keyresult_id FROM updates WHERE text ILIKE $1 LIMIT $2 OFFSET $3`,
      [`%${q}%`, limit, offset],
    );

    // Collect all needed foreign keys for batch queries
    const _userTeamIds = unique(usersResult.rows.map((u) => u.team_id));
    const teamIds = unique([
      ...teamsResult.rows.map((t) => t.id),
      ...okrsResult.rows.map((o) => o.team_id),
      ...keyResultsResult.rows.map((kr) => kr.team_id),
      ...updatesResult.rows.map((u) => u.team_id),
    ]);
    const userIds = unique([
      ...usersResult.rows.map((u) => u.id),
      ...okrsResult.rows.map((o) => o.owner_id),
      ...keyResultsResult.rows.map((kr) => kr.owner_id),
      ...updatesResult.rows.map((u) => u.author_id),
    ]);
    const okrIds = unique([
      ...okrsResult.rows.map((o) => o.id),
      ...keyResultsResult.rows.map((kr) => kr.okr_id),
      ...updatesResult.rows.map((u) => u.okr_id),
    ]);
    const keyresultIds = unique([
      ...keyResultsResult.rows.map((kr) => kr.id),
      ...updatesResult.rows.map((u) => u.keyresult_id),
    ]);

    // Batch fetch related entities
    const [allTeams, allUsers, allOkrs, allKeyresults] = await Promise.all([
      teamIds.length
        ? db.query(`SELECT id, name FROM teams WHERE id = ANY($1)`, [teamIds])
        : { rows: [] },
      userIds.length
        ? db.query(`SELECT id, name, email FROM users WHERE id = ANY($1)`, [
            userIds,
          ])
        : { rows: [] },
      okrIds.length
        ? db.query(
            `SELECT id, title, description, owner_id, team_id FROM okrs WHERE id = ANY($1)`,
            [okrIds],
          )
        : { rows: [] },
      keyresultIds.length
        ? db.query(
            `SELECT id, text, okr_id, owner_id, team_id FROM keyresults WHERE id = ANY($1)`,
            [keyresultIds],
          )
        : { rows: [] },
    ]);

    // Index for quick lookup
    const teamMap = Object.fromEntries(allTeams.rows.map((t) => [t.id, t]));
    const userMap = Object.fromEntries(allUsers.rows.map((u) => [u.id, u]));
    const okrMap = Object.fromEntries(allOkrs.rows.map((o) => [o.id, o]));
    const keyresultMap = Object.fromEntries(
      allKeyresults.rows.map((kr) => [kr.id, kr]),
    );

    // Fetch related entities for each type, handle nulls gracefully
    const userResults = usersResult.rows.map((user) => ({
      type: 'user',
      user,
      teams: user.team_id ? [teamMap[user.team_id]].filter(Boolean) : [],
      okrs: okrsResult.rows.filter((o) => o.owner_id === user.id),
      keyresults: keyResultsResult.rows.filter((kr) => kr.owner_id === user.id),
      updates: updatesResult.rows.filter((u) => u.author_id === user.id),
      relevance: getRelevanceScore(user, q, ['name', 'email']),
    }));

    const teamResults = teamsResult.rows.map((team) => ({
      type: 'team',
      team,
      users: usersResult.rows.filter((u) => u.team_id === team.id),
      okrs: okrsResult.rows.filter((o) => o.team_id === team.id),
      keyresults: keyResultsResult.rows.filter((kr) => kr.team_id === team.id),
      updates: updatesResult.rows.filter((u) => u.team_id === team.id),
      relevance: getRelevanceScore(team, q, ['name']),
    }));

    const okrResults = okrsResult.rows.map((okr) => ({
      type: 'okr',
      okr,
      owner: okr.owner_id ? userMap[okr.owner_id] : null,
      team: okr.team_id ? teamMap[okr.team_id] : null,
      keyresults: keyResultsResult.rows.filter((kr) => kr.okr_id === okr.id),
      updates: updatesResult.rows.filter((u) => u.okr_id === okr.id),
      relevance: getRelevanceScore(okr, q, ['title', 'description']),
    }));

    const keyresultResults = keyResultsResult.rows.map((kr) => ({
      type: 'keyresult',
      keyresult: kr,
      okr: kr.okr_id ? okrMap[kr.okr_id] : null,
      owner: kr.owner_id ? userMap[kr.owner_id] : null,
      team: kr.team_id ? teamMap[kr.team_id] : null,
      updates: updatesResult.rows.filter((u) => u.keyresult_id === kr.id),
      relevance: getRelevanceScore(kr, q, ['text']),
    }));

    const updateResults = updatesResult.rows.map((update) => ({
      type: 'update',
      update,
      author: update.author_id ? userMap[update.author_id] : null,
      okr: update.okr_id ? okrMap[update.okr_id] : null,
      team: update.team_id ? teamMap[update.team_id] : null,
      keyresult: update.keyresult_id ? keyresultMap[update.keyresult_id] : null,
      relevance: getRelevanceScore(update, q, ['text']),
    }));

    // Combine all results into a single flat array, sort by relevance descending
    const results = [
      ...userResults,
      ...teamResults,
      ...okrResults,
      ...keyresultResults,
      ...updateResults,
    ]
      .filter((r) => r.relevance > 0)
      .sort((a, b) => b.relevance - a.relevance);

    res.json({ results, limit, offset });
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
