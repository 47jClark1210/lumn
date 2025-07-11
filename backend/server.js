const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Example route
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running!' });
});

// Mount API routes (add more in routes/)

const usersRoutes = require('./routes/users');
const objectivesRoutes = require('./routes/objectives');
const keyResultsRoutes = require('./routes/keyresults');
const teamsRoutes = require('./routes/teams');
const commentsRoutes = require('./routes/comments');

app.use('/api/users', usersRoutes);
app.use('/api/objectives', objectivesRoutes);
app.use('/api/keyresults', keyResultsRoutes);
app.use('/api/teams', teamsRoutes);
app.use('/api/comments', commentsRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack for debugging
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    error: {
      message: err.message || 'Internal Server Error',
    },
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
