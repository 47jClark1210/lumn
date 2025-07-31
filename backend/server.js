const express = require('express');
const cors = require('cors');
const logger = require('./utils/logger');
const path = require('path');
const { fileURLToPath } = require('url');
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5000;

// CORS: Allow requests from frontend
app.use(
  cors({
    origin: 'http://localhost:3000', // React dev server
    credentials: true,
  }),
);

app.use(express.json());

// Serve static files for avatars
app.use(
  '/uploads/avatars',
  express.static(path.join(__dirname, 'uploads/avatars')),
);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running!' });
});

// Mount API routes
const usersRoutes = require('./routes/users');
const keyResultsRoutes = require('./routes/keyresults');
const teamsRoutes = require('./routes/teams');
const updatesRoutes = require('./routes/updates');
const okrsRoutes = require('./routes/okrs');
const authRoutes = require('./routes/auth');
const searchRoutes = require('./routes/search');
const favoritesRoutes = require('./routes/favorites');

app.use('/api/users', usersRoutes);
app.use('/api/keyresults', keyResultsRoutes);
app.use('/api/teams', teamsRoutes);
app.use('/api/updates', updatesRoutes);
app.use('/api/okrs', okrsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/favorites', favoritesRoutes);

// Global error handler
app.use((err, req, res, _next) => {
  logger.error(err.stack);
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    error: {
      message: err.message || 'Internal Server Error',
    },
  });
});

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
