const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000; // Use Render's PORT or default to 3000

// Load the quizzes JSON file
const quizzes = JSON.parse(fs.readFileSync(path.join(__dirname, 'backend', 'quizzes.json'), 'utf-8'));

// API endpoint to fetch questions by skill
app.get('/api/questions/:skill', (req, res) => {
  const skill = req.params.skill.toLowerCase();
  if (quizzes[skill]) {
    res.json(quizzes[skill]);
  } else {
    res.status(404).json({ error: 'Skill not found' });
  }
});

// Serve static files (your frontend)
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});