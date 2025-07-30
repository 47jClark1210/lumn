const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');
const leaderboardService = require('../services/leaderboardService');

// Get leaderboard for a team
router.get('/team/:teamId', requireAuth, async (req, res) => {
  const { teamId } = req.params;
  try {
    const leaderboard = await leaderboardService.getTeamLeaderboard(teamId);
    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get global leaderboard (all teams)
router.get('/global', requireAuth, async (req, res) => {
  try {
    const leaderboard = await leaderboardService.getGlobalLeaderboard();
    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
