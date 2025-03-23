const express = require('express');
const router = express.Router();
const { initiateGithubOAuth, handleGithubCallback } = require('../controllers/githubController');

// Route to initiate GitHub OAuth
router.get('/', initiateGithubOAuth);

// Callback route for GitHub OAuth
router.get('/callback', handleGithubCallback);

module.exports = router;
