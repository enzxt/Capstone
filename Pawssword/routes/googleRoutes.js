const express = require('express');
const router = express.Router();

const {
  initiateGoogleOAuth,
  handleGoogleCallback
} = require('../controllers/googleController');

// Route to initiate the OAuth flow
router.get('/', initiateGoogleOAuth);

// Callback route for Google's response
router.get('/callback', handleGoogleCallback);

module.exports = router;
