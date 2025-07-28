const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');
const requireRole = require('../middleware/requireRole');
const reportService = require('../services/reportService');

// Get updates for a specific OKR
router.get('/okr/:okrId/updates', requireAuth, async (req, res) => {
  const { okrId } = req.params;
  try {
    const updates = await reportService.getOkrUpdatesReport(okrId);
    res.json(updates);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get update summary for a team
router.get('/team/:teamId/updates-summary', requireAuth, requireRole('super_admin', 'org_admin'), async (req, res) => {
  const { teamId } = req.params;
  try {
    const summary = await reportService.getTeamUpdatesReport(teamId);
    res.json(summary);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ...existing endpoints...

module.exports = router;