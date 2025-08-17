import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Auth0Provider } from '@auth0/auth0-react'; 
import './index.css'
import App from './App.jsx'

// Auth0 configuration
const domain = import.meta.env.VITE_AUTH0_DOMAIN || "dev-1w0vjbctumke75w2.us.auth0.com";
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID || "2hIKUv3KiFaaRKhqPJbCPTDmeviSP2TW";
const redirectUri = import.meta.env.VITE_AUTH0_REDIRECT_URI || window.location.origin;

console.log('🔐 Auth0 Config:', { domain, clientId, redirectUri });
console.log('🌐 Current URL:', window.location.href);
console.log('📦 Environment variables:', {
  VITE_AUTH0_DOMAIN: import.meta.env.VITE_AUTH0_DOMAIN,
  VITE_AUTH0_CLIENT_ID: import.meta.env.VITE_AUTH0_CLIENT_ID,
  VITE_AUTH0_REDIRECT_URI: import.meta.env.VITE_AUTH0_REDIRECT_URI
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectUri,
        scope: "openid profile email"
      }}
      cacheLocation="localstorage"
      useRefreshTokens={true}
      useRefreshTokensFallback={false}
      skipRedirectCallback={window.location.pathname === '/callback'}
      onRedirectCallback={(appState) => {
        console.log('✅ Auth0 Redirect Callback:', appState);
        // Preserve the current location or go to intended destination
        const targetUrl = appState?.returnTo || window.location.pathname || '/mode';
        window.history.replaceState({}, document.title, targetUrl);
      }}
    >
      <App />
    </Auth0Provider>
  </StrictMode>
)
