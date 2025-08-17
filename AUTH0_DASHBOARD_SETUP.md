# Auth0 Dashboard Configuration for CodeClash

## Critical Settings for Auth0 Dashboard

### 1. Application Settings
- **Name**: CodeClash
- **Domain**: dev-1w0vjbctumke75w2.us.auth0.com
- **Client ID**: 2hIKUv3KiFaaRKhqPJbCPTDmeviSP2TW
- **Application Type**: **Single Page Application** (This is CRITICAL!)

### 2. Application URIs
**Allowed Callback URLs:**
```
http://localhost:5174,
http://localhost:5174/callback,
http://localhost:5174/mode
```

**Allowed Logout URLs:**
```
http://localhost:5174,
http://localhost:5174/
```

**Allowed Web Origins:**
```
http://localhost:5174
```

**Allowed Origins (CORS):**
```
http://localhost:5174
```

### 3. Advanced Settings

#### Grant Types (MUST be enabled):
- [x] Authorization Code
- [x] Refresh Token
- [x] Implicit (for backward compatibility)

#### Token Settings:
- **Token Endpoint Authentication Method**: None (for SPA)
- **OIDC Conformant**: Enabled
- **JsonWebToken Signature Algorithm**: RS256

### 4. IMPORTANT: Refresh Token Settings
- **Refresh Token Rotation**: Enabled
- **Refresh Token Expiration**: Enabled
- **Absolute Lifetime**: 2592000 seconds (30 days)
- **Inactivity Lifetime**: 1209600 seconds (14 days)

### 5. Cross-Origin Authentication
- **Allowed Origins (CORS)**: http://localhost:5173

## Common Issues and Solutions

### 401 Unauthorized Error
1. **Check Application Type**: Must be "Single Page Application"
2. **Verify Grant Types**: Authorization Code must be enabled
3. **Check Token Endpoint Authentication**: Must be "None" for SPA
4. **Verify Callback URLs**: Must exactly match your redirect URI

### CORS Errors
1. Add your localhost URL to "Allowed Origins (CORS)"
2. Add your localhost URL to "Allowed Web Origins"

### Token Exchange Errors
1. Ensure OIDC Conformant is enabled
2. Check that refresh token settings are properly configured
3. Verify that the client is not trying to use client_secret (SPAs don't use secrets)

## Testing Steps
1. Clear browser cache and localStorage
2. Go to http://localhost:5173
3. Click login button
4. Should redirect to Auth0 login page
5. After login, should redirect back with code parameter
6. Token exchange should happen automatically
7. Should redirect to /mode page

## Debug Commands
Open browser console and check for:
- Auth0 configuration logs
- Network requests to Auth0 endpoints
- Any CORS or authentication errors
