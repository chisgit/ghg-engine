import { OktaAuth, type OktaAuthOptions } from '@okta/okta-auth-js';

export const oktaConfig: OktaAuthOptions = {
  issuer: 'https://dev-43296795.okta.com/oauth2/default',
  clientId: '0oao52hsldb6anYgg5d7',
  redirectUri: window.location.origin + '/login/callback',
  scopes: ['openid', 'profile', 'email'],
  pkce: true,
  tokenManager: {
    storage: 'localStorage', // Make sure tokens are stored in localStorage
    autoRenew: true, // Automatically renew tokens before expiration
    expireEarlySeconds: 120 // Renew tokens 2 minutes before expiry
  },
  devMode: true // More verbose errors in development
};

export const oktaAuth = new OktaAuth(oktaConfig);

// Add a token event listener for debugging
oktaAuth.tokenManager.on('added', function(key, token) {
  console.log('Token added to storage for key:', key);
});

oktaAuth.tokenManager.on('error', function(err) {
  console.error('TokenManager error:', err);
});
