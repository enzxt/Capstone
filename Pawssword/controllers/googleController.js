require('dotenv').config();

const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;
const JWT_SECRET = process.env.JWT_SECRET;

console.log("Initializing OAuth2Client");
// console.log("CLIENT_ID:", CLIENT_ID);
// console.log("CLIENT_SECRET:", CLIENT_SECRET);
// console.log("REDIRECT_URI:", REDIRECT_URI);

const client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

const scopes = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile'
];

/**
 * GET /auth/google
 * Initiate the Google OAuth flow
 */
exports.initiateGoogleOAuth = (req, res) => {
  console.log("Initiating Google OAuth flow...");
  const authUrl = client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
  });
  console.log('Redirecting to Google OAuth URL');
  res.redirect(authUrl);
};

/**
 * GET /auth/google/callback
 * Handle the Google OAuth callback
 */
exports.handleGoogleCallback = async (req, res) => {
  console.log("Received callback from Google");
  try {
    const code = req.query.code;
    console.log("Authorization code received");

    console.log("Exchanging code for tokens...");
    const { tokens } = await client.getToken(code);
    console.log("Tokens received from Google");
    client.setCredentials(tokens);

    console.log("Requesting user info from Google...");
    const userInfoResponse = await client.request({
      url: 'https://www.googleapis.com/oauth2/v2/userinfo',
    });
    const userInfo = userInfoResponse.data;
    console.log("User info retrieved");

    console.log("Generating JWT...");
    const token = jwt.sign(
      {
        id: userInfo.id,
        email: userInfo.email,
        name: userInfo.name,
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    console.log("JWT generated");

    const redirectUrl = `http://localhost:5173/auth/google/callback?token=${token}`;
    console.log("Redirecting user to front end");
    res.redirect(redirectUrl);
  } catch (error) {
    console.error("Error during Google OAuth callback processing:", error);
    res.status(500).send("Authentication failed");
  }
};
