require('dotenv').config();
const axios = require('axios');
const jwt = require('jsonwebtoken');

const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const REDIRECT_URI = process.env.GITHUB_REDIRECT_URI;
const JWT_SECRET = process.env.JWT_SECRET;

console.log("Initializing GitHub OAuth");
// console.log("CLIENT_ID:", CLIENT_ID);
// console.log("CLIENT_SECRET:", CLIENT_SECRET);
// console.log("REDIRECT_URI:", REDIRECT_URI);

/**
 * GET /auth/github
 * Initiate the GitHub OAuth flow.
 */
exports.initiateGithubOAuth = (req, res) => {
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=user:email`;
  console.log("Redirecting to GitHub OAuth URL");
  res.redirect(githubAuthUrl);
};

/**
 * GET /auth/github/callback
 * Handle GitHub's OAuth callback.
 */
exports.handleGithubCallback = async (req, res) => {
  console.log("Received GitHub callback");
  try {
    const code = req.query.code;
    console.log("GitHub authorization code received");

    console.log("Exchanging code for access token...");
    const tokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code: code,
        redirect_uri: REDIRECT_URI,
      },
      { headers: { Accept: 'application/json' } }
    );
    const accessToken = tokenResponse.data.access_token;
    console.log("GitHub access token received");

    console.log("Requesting user info from GitHub...");
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `token ${accessToken}` },
    });
    const userInfo = userResponse.data;
    console.log("GitHub user info retrieved");

    console.log("Generating JWT...");
    const token = jwt.sign(
      {
        id: userInfo.id,
        email: userInfo.email,
        name: userInfo.name || userInfo.login,
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    console.log("JWT generated");

    const redirectUrl = `http://localhost:5173/auth/github/callback?token=${token}`;
    console.log("Redirecting user to front end");
    res.redirect(redirectUrl);
  } catch (error) {
    console.error("Error during GitHub OAuth callback processing:", error);
    res.status(500).send("Authentication failed");
  }
};
