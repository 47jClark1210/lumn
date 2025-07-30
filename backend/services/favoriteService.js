const db = require('../models/db');

// Get all favorites for a user
async function getUserFavorites(userId) {
  const result = await db.query(
    'SELECT * FROM user_favorites WHERE user_id = $1 ORDER BY created_at DESC',
    [userId],
  );
  return result.rows;
}

// Add a favorite for a user
async function addUserFavorite(userId, favoriteType, favoriteId) {
  const result = await db.query(
    `INSERT INTO user_favorites (user_id, favorite_type, favorite_id)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id, favorite_type, favorite_id) DO NOTHING
     RETURNING *`,
    [userId, favoriteType, favoriteId],
  );
  return result.rows[0];
}

// Remove a favorite for a user
async function removeUserFavorite(userId, favoriteType, favoriteId) {
  await db.query(
    `DELETE FROM user_favorites WHERE user_id = $1 AND favorite_type = $2 AND favorite_id = $3`,
    [userId, favoriteType, favoriteId],
  );
}

/**
 * Reorder user favorites.
 * @param {number} userId
 * @param {Array<{id: number, order: number}>} orderList
 * @returns {Promise<void>}
 */
async function reorderFavorites(userId, orderList) {
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');
    for (const { id, order } of orderList) {
      await client.query(
        'UPDATE user_favorites SET "order" = $1 WHERE id = $2 AND user_id = $3',
        [order, id, userId],
      );
    }
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

module.exports = {
  getUserFavorites,
  addUserFavorite,
  removeUserFavorite,
  reorderFavorites,
};
