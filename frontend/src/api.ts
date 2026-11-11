const BACKEND_API_URL = 'https://followup-desk-api.onrender.com';
const configuredApiUrl = import.meta.env.VITE_API_URL?.trim().replace(/\/+$/, '');

// Keep production requests pointed at the API even when an ignored local
// .env.production file is missing from the deployment checkout.
export const API_URL = configuredApiUrl === BACKEND_API_URL ? configuredApiUrl : BACKEND_API_URL;

console.info('[FollowUp Desk] API base URL:', API_URL);
