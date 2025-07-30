CREATE TABLE user_favorites (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  favorite_type VARCHAR(32) NOT NULL, -- e.g. 'okr', 'module', etc.
  favorite_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, favorite_type, favorite_id)
);