# Melvin

        - Loading -

     ██████████████▒ 97%
     
```java
// Progress
public String progress = "Production";

// Contributors
public String dev = "Enzo Tinard";

// Timeline
public String time = "Week 15";
```
# Breakdown
``` java
    public class Melvin {

    // Front end web app using React and Tailwind:
    // - Built with React to deliver a dynamic, component-based user interface.
    // - Styled with Tailwind CSS for rapid, responsive design.
    // - Responsible for displaying cats, user settings, and overall navigation.
    Product DailyWhisker;

    // Backend SSO service ("Pawssword"):
    // - Provides secure, centralized authentication (Single Sign-On) for the application.
    // - Integrates with external OAuth providers such as Google and GitHub.
    // - Manages user sessions and ensures secure access to app resources.
    Product Pawssword;
}
```
# Pawssword – API Documentation

Express server handling Google and GitHub OAuth authentication.  
After authentication, users are issued a secure JWT. User documents are automatically created in Firestore if they don't already exist.

## Tech Stack
- Express.js
- Google OAuth 2.0
- GitHub OAuth 2.0
- JWT (JSON Web Tokens)
- Firebase Authentication
- Firebase Firestore

## Setup
1. Clone the repository
2. Run `npm install`
3. Create a `.env` file with the following keys:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `GOOGLE_REDIRECT_URI`
   - `GITHUB_CLIENT_ID`
   - `GITHUB_CLIENT_SECRET`
   - `GITHUB_REDIRECT_URI`
   - `JWT_SECRET`
4. Start server with:
   ```bash
   node server.js
## Routes

| Method | Endpoint | Description |
|:------:|:--------:|:-----------:|
| GET | `/auth/google` | Initiates Google OAuth login |
| GET | `/auth/google/callback` | Handles Google OAuth callback, generates JWT, redirects to frontend |
| GET | `/auth/github` | Initiates GitHub OAuth login |
| GET | `/auth/github/callback` | Handles GitHub OAuth callback, generates JWT, redirects to frontend |
| GET | `/home` | Simple server status confirmation route |
## Security

- **OAuth Tokens:** Access tokens from Google and GitHub are never stored or exposed to the frontend.
- **JWT Authentication:** After successful login, users are issued a secure, signed JWT. This token contains only minimal user information (id, email, name) and expires in 1 hour.
- **Environment Variables:** Sensitive credentials (client IDs, secrets, JWT secret) are stored securely in a `.env` file and are not committed to the repository.
- **Firestore Security:** User documents are created with basic information only (email, lastGeneratedCatId, lastGeneratedTimestamp, bookmarks). Firestore rules will be configured to allow access only to the authenticated user's own document.
- **HTTPS Recommendation:** For production deployments, all authentication traffic is served over HTTPS to protect tokens and credentials in transit.
- **No Credential Logging:** Production builds removed or disabled console logs containing OAuth tokens or sensitive data.
