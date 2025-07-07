#!/usr/bin/node

// prepare with: npm install express

const express = require('express');
const path = require('path');
const app = express();
// Disable caching FIRST (for development only)
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

app.post('/api/activity', (req, res) => {
  res.json({ got: req.body, 'server time': new Date().toISOString() });
});
app.use((req, res) => {res.status(404).send(`<h1>Page does not exist</h1>`)});

const PORT = 8100;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
