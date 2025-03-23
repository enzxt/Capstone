/**
 * Main Express Server
 *
 * This module initializes an Express server and mounts authentication routes for both Google and GitHub.
 * It also defines a simple "/home" route for testing successful authentication.
 */
const express = require('express');
const googleRoutes = require('./routes/googleRoutes');
const githubRoutes = require('./routes/githubRoutes');

const app = express();

app.use('/auth/google', googleRoutes);
app.use('/auth/github', githubRoutes);

app.get('/home', (req, res) => {
  console.log("Backend /home route accessed.");
  res.send("Logged in successfully! Welcome to DailyWhisker Home.");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
