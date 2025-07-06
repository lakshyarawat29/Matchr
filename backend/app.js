const express = require('express');
const app = express();

// Middleware, routes, etc.
app.use(express.json()); // Example

// Example route
app.get('/', (req, res) => {
  res.send('API is running');
});

const matchRoutes = require('./routes/matchRoutes');
app.use('/api', matchRoutes);


module.exports = app;
