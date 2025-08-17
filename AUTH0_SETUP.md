# Auth0 Setup Instructions

## Environment Variables Setup

Create a `.env` file in the `fe` directory with the following content:

```env
# Auth0 Configuration
VITE_AUTH0_DOMAIN=dev-1w0vjbctumke75w2.us.auth0.com
VITE_AUTH0_CLIENT_ID=2hIKUv3KiFaaRKhqPJbCPTDmeviSP2TW
VITE_AUTH0_REDIRECT_URI=http://localhost:5174

# Backend API URLs
VITE_API_BASE_URL=http://localhost:4444
VITE_SOCKET_URL=http://localhost:3000
```

## Auth0 Dashboard Configuration

Make sure your Auth0 application has the following settings:

1. **Application Type**: Single Page Application (SPA)
2. **Allowed Callback URLs**: 
   - `http://localhost:5174`
   - `http://localhost:5174/callback`
3. **Allowed Logout URLs**: 
   - `http://localhost:5174`
4. **Allowed Web Origins**: 
   - `http://localhost:5174`
5. **Allowed Origins (CORS)**: 
   - `http://localhost:5174`

## Common Issues and Solutions

### 401 Unauthorized Error
- Verify the Client ID and Domain are correct
- Check that the redirect URI matches exactly in Auth0 dashboard
- Ensure the application type is set to "Single Page Application"
- Make sure refresh tokens are disabled for SPA applications

### CORS Issues
- Add your localhost URL to Allowed Origins in Auth0 dashboard
- Ensure Web Origins includes your frontend URL

## Running the Application

1. Start the backend: `cd be && npm start`
2. Start the frontend: `cd fe && npm run dev`
3. Open browser to `http://localhost:5174`
