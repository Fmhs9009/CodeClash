import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Auth0Provider } from '@auth0/auth0-react'; 
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  
    <Auth0Provider
      domain="dev-eceampxv4slskt4x.us.auth0.com"
      clientId="wjQr7HPlOximXo51Hq37Mr9te778CJep"
      authorizationParams={{
        redirect_uri: window.location.origin
      }}
    >
      <App />
    </Auth0Provider>
  
)
