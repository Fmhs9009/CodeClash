// API Configuration - using environment variables
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4444';
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

// Validate environment variables in development
if (import.meta.env.DEV) {
  console.log('🔧 API Configuration:', {
    API_BASE_URL,
    SOCKET_URL,
    VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
    VITE_SOCKET_URL: import.meta.env.VITE_SOCKET_URL
  });
}

// Helper function to build API endpoints
export const buildApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
};
