const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');
const favoriteService = require('../services/favoriteService');

// Get all favorites for the logged-in user
router.get('/', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const favorites = await favoriteService.getUserFavorites(userId);
    res.json(favorites);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
});

// Add a favorite
router.post('/', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { favoriteType, favoriteId } = req.body;
    const fav = await favoriteService.addUserFavorite(
      userId,
      favoriteType,
      favoriteId,
    );
    res.status(201).json(fav);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add favorite' });
  }
});

// Remove a favorite
router.delete('/', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { favoriteType, favoriteId } = req.body;
    await favoriteService.removeUserFavorite(userId, favoriteType, favoriteId);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove favorite' });
  }
});

// POST /api/favorites/reorder
router.post('/reorder', requireAuth, async (req, res) => {
  const userId = req.user.id;
  const { orderList } = req.body; // [{id, order}, ...]
  if (!Array.isArray(orderList)) {
    return res.status(400).json({ error: 'orderList must be an array.' });
  }
  try {
    await favoriteService.reorderFavorites(userId, orderList);
    res.json({ success: true });
  } catch (err) {
    console.error('Reorder favorites error:', err);
    res.status(500).json({ error: 'Failed to reorder favorites.' });
  }
});

module.exports = router;
