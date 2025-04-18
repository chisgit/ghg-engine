/**
 * Okta Diagnostics Runner
 * Convert the TypeScript to JavaScript and run in browser console
 */

// Import from okta-auth-checker.ts won't work directly in browser
// so we'll copy the essential functions here

function checkTokenStorage() {
  console.log('==== OKTA TOKEN STORAGE CHECKER ====');
  
  // Check localStorage
  console.log('Checking localStorage for Okta tokens:');
  const localStorageKeys = Object.keys(localStorage).filter(key => 
    key.includes('okta') || key.includes('token') || key.includes('auth'));
  
  if (localStorageKeys.length > 0) {
    console.log('Found potential Okta keys in localStorage:', localStorageKeys);
    localStorageKeys.forEach(key => {
      try {
        console.log(`${key}:`, localStorage.getItem(key));
      } catch (e) {
        console.log(`Could not read ${key}:`, e);
      }
    });
  } else {
    console.log('No Okta-related keys found in localStorage');
  }
  
  // Check sessionStorage
  console.log('Checking sessionStorage for Okta tokens:');
  const sessionStorageKeys = Object.keys(sessionStorage).filter(key => 
    key.includes('okta') || key.includes('token') || key.includes('auth'));
  
  if (sessionStorageKeys.length > 0) {
    console.log('Found potential Okta keys in sessionStorage:', sessionStorageKeys);
    sessionStorageKeys.forEach(key => {
      try {
        console.log(`${key}:`, sessionStorage.getItem(key));
      } catch (e) {
        console.log(`Could not read ${key}:`, e);
      }
    });
  } else {
    console.log('No Okta-related keys found in sessionStorage');
  }
  
  // Check cookies
  console.log('Checking cookies for Okta tokens:');
  const cookies = document.cookie.split(';').map(cookie => cookie.trim());
  const oktaCookies = cookies.filter(cookie => 
    cookie.includes('okta') || cookie.includes('token') || cookie.includes('auth'));
  
  if (oktaCookies.length > 0) {
    console.log('Found potential Okta cookies:', oktaCookies);
  } else {
    console.log('No Okta-related cookies found');
  }
  
  console.log('==== END STORAGE CHECK ====');
}

function validateOktaConfig() {
  console.log('==== VALIDATING OKTA CONFIG ====');
  
  const config = {
    clientId: '0oao52hsldb6anYgg5d7',
    issuer: 'https://dev-43296795.okta.com/oauth2/default',
    redirectUri: window.location.origin + '/login/callback'
  };
  
  // Output config
  console.log('Okta Config:', config);
  
  // Validation checks
  if (config.redirectUri) {
    // Check if redirectUri matches current origin
    const currentOrigin = window.location.origin;
    if (!config.redirectUri.startsWith(currentOrigin)) {
      console.warn(`redirectUri (${config.redirectUri}) doesn't match current origin (${currentOrigin})`);
    } else {
      console.log('✓ redirectUri matches current origin');
    }
  }
  
  console.log('==== END CONFIG VALIDATION ====');
  return config;
}

function monitorOktaNetwork() {
  console.log('==== MONITORING OKTA NETWORK REQUESTS ====');
  console.log('Watching for Okta-related network requests...');
  
  // Store original fetch
  const originalFetch = window.fetch;
  window.fetch = function(...args) {
    const url = args[0];
    if (typeof url === 'string' && url.includes('okta')) {
      console.log('Okta fetch request:', url);
    }
    return originalFetch.apply(this, args);
  };
  
  // Store original XHR open
  const originalXHROpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(...args) {
    const url = args[1];
    if (typeof url === 'string' && url.includes('okta')) {
      console.log('Okta XHR request:', url);
    }
    return originalXHROpen.apply(this, args);
  };
  
  console.log('Network monitoring active. Please attempt login...');
}

function runFullDiagnostics() {
  console.log('==== RUNNING COMPLETE OKTA DIAGNOSTICS ====');
  
  // Output diagnostic metadata
  console.log('Current URL:', window.location.href);
  console.log('Origin:', window.location.origin);
  console.log('User Agent:', navigator.userAgent);
  
  // Validate configuration
  const config = validateOktaConfig();
  
  // Check storage
  checkTokenStorage();
  
  // Setup network monitoring
  monitorOktaNetwork();
  
  console.log('==== DIAGNOSTIC INITIALIZATION COMPLETE ====');
  console.log('Please attempt login to continue diagnostics...');
  
  return `
OKTA APPLICATION CONFIGURATION CHECKLIST:

1. Login to Okta Developer Dashboard at https://dev-43296795-admin.okta.com/

2. Navigate to Applications > Applications

3. Select your application (Client ID: 0oao52hsldb6anYgg5d7)

4. Verify these settings:
   - Sign-in redirect URIs: Should include http://localhost:4200/login/callback
   - Sign-out redirect URIs: Should include http://localhost:4200
   - Allowed grant types: Should include "Authorization Code" and "Refresh Token"
   - PKCE should be enabled for Authorization Code

5. Under "General Settings":
   - Ensure "Authentication method" is set to PKCE
   
6. Under "Assignments":
   - Verify user/group assignments include test users

7. Under "API":
   - Ensure proper scopes are configured (openid, profile, email)

8. Save any changes
`;
}

// Instructions for how to use this file
console.log(`
HOW TO USE OKTA DIAGNOSTICS:

1. Open your Angular application in browser
2. Open browser developer tools (F12)
3. Go to Console tab
4. Copy and paste this entire file into the console
5. Run: runFullDiagnostics()
6. Attempt to log in
7. Check console for diagnostic information
`);
