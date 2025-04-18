## CORE PRINCIPLES
 - NEVER remove existing functionality
 - Maintain data model integrity
 - Preserve all EXISTING FUNCTIONALITY
 - Keep performance optimizations
 - Update VECTOR_CONTEXT.json when modifying functionality to maintain accurate feature tracking
 - Ensure that you have a clear understanding of how your code is going to affect other components in the system
 - ALWAYS PROVIDE TERMINAL COMMANDS IN POWERSHELL FOR WINDOWS 
 - I LIKE ONE WORD ANSWERS WHERE POSSIBLE.
 - OPTIMIZE TOKENS, I WILL ASK FOR ADDITIONAL INFO.
 - KEEP THE CHANGES SMALL SO WE CAN TEST EACH PIECE.
 - DO NOT REMOVE PREVIOUS CONSOLE OUT PRINTS THEY ARE THERE FOR A REASON!
 - NEVER REMOVE EXISTING FUNCTIONALITY - THINGS ARE IN PLACE FOR A GOOD REASON
 - LETS USE AGILE AND TEST DRIVEN APPROACHES TO MAKE SMALL CHANGES AND ITERATE
 - ASK BEFORE MAKING THE NEXT SET OF CHANGES.
 - I am coding using Node.js 
 - Node.js version compatibility: Use LTS version 18.x or 20.x for best compatibility with dependencies
 - For Angular 15.2.x, choose ONE approach - either all standalone components OR traditional NgModule pattern
 - Mixing standalone components with NgModule pattern requires proper bootstrapping configuration
 - Update SYSTEM_INSTRUCTIONS.md with the latest updates where it makes sense
# File Upload UI - System Instructions

## VERSION REQUIREMENTS
- Node.js: LTS version 20.x (AWS Lambda compatible)
- Angular: 15.2.x with standalone components

## TROUBLESHOOTING

### Authentication Issues
- **Symptom**: Page reloads after login but `isAuthenticated` remains false
- **Symptom**: Token redirect followed by returning to login page (redirect loop)
- **Possible causes**:
  1. Callback URL misconfiguration in Okta
  2. Missing or incorrect redirect handling
  3. Token storage issues
  4. CORS configuration problems
  5. Incorrect Okta configuration in app
  6. Token processing failure
  7. Hash fragment not being properly processed

### Authentication Debugging Steps
1. Verify Okta application configuration:
   - Login redirect URI should match application URL
   - Allowed origins should include development URL
   - Implicit flow with PKCE should be enabled
   - Make sure login redirect URI includes the exact callback path your app expects

2. Check browser storage:
   - Inspect localStorage/sessionStorage for tokens
   - Check for cookie restrictions (SameSite, Secure flags)
   - Verify browser's cookie/localStorage policies aren't blocking storage

3. Network request analysis:
   - Verify redirect_uri parameter in authentication request
   - Check for CORS errors in console
   - Ensure token endpoint is accessible
   - Look for 401/403 errors in network requests
   - Check if the token exchange request is completing successfully

4. Code verification:
   - Confirm authStateManager subscription is maintained
   - Verify token handling and storage logic
   - Check for proper initialization sequence
   - Ensure the callback handler correctly processes token information
   - Verify hash fragment handling in authentication flow

### Redirect Loop Solutions
1. Check browser console on the redirect page before it redirects again
2. Use URL parameters instead of hash fragments if hash parsing is failing
3. Verify that your Okta SDK version is compatible with Angular version
4. Add explicit token processing code to handle the redirect:
   ```typescript
   // In component handling the callback:
   this.oktaAuth.handleRedirect().then(() => {
     // Successfully processed the token
     this.router.navigate(['/dashboard']);
   }).catch(error => {
     console.error('Failed to process authentication redirect:', error);
   });
   ```
5. Check for URL encoding issues in the callback URL
6. Try clearing browser cache and cookies
7. Verify app is correctly configured for OIDC authentication flow