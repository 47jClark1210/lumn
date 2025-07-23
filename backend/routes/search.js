const express = require('express');
const router = express.Router();
const db = require('../models/db');
const requireAuth = require('../middleware/requireAuth');

router.get('/', requireAuth, async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: 'Missing search query' });

  try {
    // Search users
    const usersResult = await db.query(
      `SELECT * FROM users WHERE name ILIKE $1 OR email ILIKE $1`,
      [`%${q}%`]
    );
    // Search teams
    const teamsResult = await db.query(
      `SELECT * FROM teams WHERE name ILIKE $1`,
      [`%${q}%`]
    );
    // Search okrs
    const okrsResult = await db.query(
      `SELECT * FROM okrs WHERE title ILIKE $1 OR description ILIKE $1`,
      [`%${q}%`]
    );
    // Search keyresults
    const keyResultsResult = await db.query(
      `SELECT * FROM keyresults WHERE text ILIKE $1`,
      [`%${q}%`]
    );
    // Search updates
    const updatesResult = await db.query(
      `SELECT * FROM updates WHERE text ILIKE $1`,
      [`%${q}%`]
    );

    // For each user match, fetch related entities
    const userResults = await Promise.all(usersResult.rows.map(async user => {
      const teams = await db.query(`SELECT * FROM teams WHERE id = $1`, [user.team_id]);
      const okrs = await db.query(`SELECT * FROM okrs WHERE owner_id = $1`, [user.id]);
      const keyresults = await db.query(`SELECT * FROM keyresults WHERE owner_id = $1`, [user.id]);
      const updates = await db.query(`SELECT * FROM updates WHERE author_id = $1`, [user.id]);
      return {
        type: 'user',
        user,
        teams: teams.rows,
        okrs: okrs.rows,
        keyresults: keyresults.rows,
        updates: updates.rows
      };
    }));

    // For each team match, fetch related entities
    const teamResults = await Promise.all(teamsResult.rows.map(async team => {
      const users = await db.query(`SELECT * FROM users WHERE team_id = $1`, [team.id]);
      const okrs = await db.query(`SELECT * FROM okrs WHERE team_id = $1`, [team.id]);
      const keyresults = await db.query(`SELECT * FROM keyresults WHERE team_id = $1`, [team.id]);
      const updates = await db.query(`SELECT * FROM updates WHERE team_id = $1`, [team.id]);
      return {
        type: 'team',
        team,
        users: users.rows,
        okrs: okrs.rows,
        keyresults: keyresults.rows,
        updates: updates.rows
      };
    }));

    // For each okr match, fetch related entities
    const okrResults = await Promise.all(okrsResult.rows.map(async okr => {
      const owner = await db.query(`SELECT * FROM users WHERE id = $1`, [okr.owner_id]);
      const team = await db.query(`SELECT * FROM teams WHERE id = $1`, [okr.team_id]);
      const keyresults = await db.query(`SELECT * FROM keyresults WHERE okr_id = $1`, [okr.id]);
      const updates = await db.query(`SELECT * FROM updates WHERE okr_id = $1`, [okr.id]);
      return {
        type: 'okr',
        okr,
        owner: owner.rows[0],
        team: team.rows[0],
        keyresults: keyresults.rows,
        updates: updates.rows
      };
    }));

    // For each keyresult match, fetch related entities
    const keyresultResults = await Promise.all(keyResultsResult.rows.map(async kr => {
      const okr = await db.query(`SELECT * FROM okrs WHERE id = $1`, [kr.okr_id]);
      const owner = await db.query(`SELECT * FROM users WHERE id = $1`, [kr.owner_id]);
      const team = await db.query(`SELECT * FROM teams WHERE id = $1`, [kr.team_id]);
      const updates = await db.query(`SELECT * FROM updates WHERE keyresult_id = $1`, [kr.id]);
      return {
        type: 'keyresult',
        keyresult: kr,
        okr: okr.rows[0],
        owner: owner.rows[0],
        team: team.rows[0],
        updates: updates.rows
      };
    }));

    // For each update match, fetch related entities
    const updateResults = await Promise.all(updatesResult.rows.map(async update => {
      const author = await db.query(`SELECT * FROM users WHERE id = $1`, [update.author_id]);
      const okr = await db.query(`SELECT * FROM okrs WHERE id = $1`, [update.okr_id]);
      const team = await db.query(`SELECT * FROM teams WHERE id = $1`, [update.team_id]);
      const keyresult = await db.query(`SELECT * FROM keyresults WHERE id = $1`, [update.keyresult_id]);
      return {
        type: 'update',
        update,
        author: author.rows[0],
        okr: okr.rows[0],
        team: team.rows[0],
        keyresult: keyresult.rows[0]
      };
    }));

    // Combine all results into a single flat array
    const results = [
      ...userResults,
      ...teamResults,
      ...okrResults,
      ...keyresultResults,
      ...updateResults
    ];

    res.json({ results });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
