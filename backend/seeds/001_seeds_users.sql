INSERT INTO users (name, email, role_id, team_id)
VALUES
  ('Alice', 'alice@example.com', 1, 1),
  ('Bob', 'bob@example.com', 2, 1)
ON CONFLICT DO NOTHING;