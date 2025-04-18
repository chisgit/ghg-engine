/**
 * Okta Authentication Diagnostic Tool
 * 
 * This file provides helper functions to diagnose and fix Okta authentication issues.
 * Run these checks when authentication fails despite successful login redirects.
 */

/**
 * Checks browser storage for Okta tokens
 * Run this in browser console after attempting login
 */
export function checkTokenStorage() {
  console.log('==== OKTA TOKEN STORAGE CHECKER ====');
  
  // Check localStorage
  console.log('Checking localStorage for Okta tokens:');
  const localStorageKeys = Object.keys(localStorage).filter(key => 
    key.includes('okta') || key.includes('token') || key.includes('auth'));
  
  if (localStorageKeys.length > 0) {
    console.log('Found potential Okta keys in localStorage:', localStorageKeys);
  } else {
    console.log('No Okta-related keys found in localStorage');
  }
  
  // Check sessionStorage
  console.log('Checking sessionStorage for Okta tokens:');
  const sessionStorageKeys = Object.keys(sessionStorage).filter(key => 
    key.includes('okta') || key.includes('token') || key.includes('auth'));
  
  if (sessionStorageKeys.length > 0) {
    console.log('Found potential Okta keys in sessionStorage:', sessionStorageKeys);
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

/**
 * Checks network requests for Okta authentication
 * Run this in browser console before attempting login
 */
export function monitorOktaNetwork() {
  console.log('==== MONITORING OKTA NETWORK REQUESTS ====');
  console.log('Watching for Okta-related network requests...');
  
  const originalFetch = window.fetch;
  window.fetch = function(...args) {
    const url = args[0];
    if (typeof url === 'string' && url.includes('okta')) {
      console.log('Okta fetch request:', url);
    }
    return originalFetch.apply(this, args);
  };
  
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

/**
 * Checks Okta configuration in application
 * @param config Your Okta configuration object
 */
export function validateOktaConfig(config: any) {
  console.log('==== VALIDATING OKTA CONFIG ====');
  
  // Check required fields
  const requiredFields = ['clientId', 'issuer', 'redirectUri'];
  for (const field of requiredFields) {
    if (!config[field]) {
      console.error(`Missing required field: ${field}`);
    } else {
      console.log(`✓ ${field}: ${config[field]}`);
    }
  }
  
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
}

/**
 * Instructions for verifying Okta application settings
 */
export const oktaConfigurationChecklist = `
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
   - Check "Client acting on behalf of itself" if using service tokens
   
6. Under "Assignments":
   - Verify user/group assignments include test users

7. Under "API":
   - Ensure proper scopes are configured (openid, profile, email)

8. Save any changes
`;

/**
 * Performs all checks at once and outputs detailed diagnostic information
 * @param config Your Okta configuration object
 */
export function runFullDiagnostics(config: any) {
  console.log('==== RUNNING COMPLETE OKTA DIAGNOSTICS ====');
  
  // Output diagnostic metadata
  console.log('Current URL:', window.location.href);
  console.log('Origin:', window.location.origin);
  console.log('User Agent:', navigator.userAgent);
  
  // Validate configuration
  validateOktaConfig(config);
  
  // Check storage
  checkTokenStorage();
  
  // Setup network monitoring
  monitorOktaNetwork();
  
  console.log('==== DIAGNOSTIC INITIALIZATION COMPLETE ====');
  console.log('Please attempt login to continue diagnostics...');
  console.log(oktaConfigurationChecklist);
}

/**
 * Example usage in PowerShell:
 * 
 * # Add to app.component.ts or file-upload.component.ts:
 * 
 * import { runFullDiagnostics } from './okta-auth-checker';
 * 
 * ngOnInit() {
 *   runFullDiagnostics({
 *     clientId: '0oao52hsldb6anYgg5d7',
 *     issuer: 'https://dev-43296795.okta.com/oauth2/default',
 *     redirectUri: window.location.origin + '/login/callback'
 *   });
 * }
 */
