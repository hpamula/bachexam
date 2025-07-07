#!/usr/bin/node

// prepare with: npm install express

const express = require('express');
const path = require('path');
const app = express();
const fs = require('fs');
// Disable caching FIRST (for development only)
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/api/my_subjects', (req, res) => {
  res.sendFile(`${__dirname}/data/my_subjects.json`);
});
app.get('/api/question', (req, res) => {
  const subject = req.query.subject; // e.g. /api/question?subject=Fizyka

  fs.readFile(`${__dirname}/data/my_answered_perplexity_llm.json`, 'utf-8', (err, data) => {
    const json = JSON.parse(data);
    if (!subject || !json[subject])
      return res.status(404).json({ error: 'Subject not found.' });
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify({ [subject]: json[subject] }, null, 2)); 
  });
});
app.get('/api/my_questions', (req, res) => {
  res.sendFile(`${__dirname}/data/my_questions.json`);
});
app.use((req, res) => {res.status(404).send(`<h1>Page does not exist</h1>`)});

const PORT = 8100;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
