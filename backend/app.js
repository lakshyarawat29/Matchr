const express = require('express');
const app = express();

// Middleware, routes, etc.
app.use(express.json()); // Example

// Example route
app.get('/', (req, res) => {
  res.send('API is running');
});

module.exports = app; // ✅ This is crucial
