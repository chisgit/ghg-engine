import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Import Router
import { OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';

/**
 * Custom callback component that explicitly handles the Okta callback process
 * and provides detailed logging to help diagnose authentication issues.
 */
@Component({
  template: `<div>Processing authentication... Please wait.</div>`,
  standalone: true
})
export class CustomCallbackComponent implements OnInit {
  constructor(
    @Inject(OKTA_AUTH) private oktaAuth: OktaAuth,
    private router: Router // Inject Router
  ) {
    console.log('[CustomCallback] Constructor');
  }
  async ngOnInit() {
    try {
      console.log('[CustomCallback] ngOnInit - Beginning token exchange');
      
      // Check if we're on the callback URL with an authorization code
      const hasAuthCode = window.location.href.indexOf('code=') >= 0;
      if (!hasAuthCode) {
        console.error('[CustomCallback] No authorization code found in URL');
        this.router.navigate(['/']); // Use router
        return;
      }
      
      console.log(`[CustomCallback] Current URL: ${window.location.href}`);

      // IMPORTANT! Check if we're in an infinite redirect loop scenario
      // by looking at the redirect history in session storage
      const redirectHistory = sessionStorage.getItem('oktaRedirectCount');
      const redirectCount = redirectHistory ? parseInt(redirectHistory, 10) : 0;

      console.log(`[CustomCallback] Redirect count: ${redirectCount}`);

      if (redirectCount > 2) {
        console.error('[CustomCallback] Too many redirects detected. Breaking loop and navigating to root');
        // Clear redirect count
        sessionStorage.removeItem('oktaRedirectCount');

        // Clear all storage to get to a clean state
        this.oktaAuth.tokenManager.clear();
        try {
          localStorage.clear();
          sessionStorage.clear();
        } catch (e) {
          console.error('[CustomCallback] Error clearing storage:', e);
        }

        // Force navigate to root using Angular router
        this.router.navigate(['/']); // Use router
        return;
      }

      // Update redirect count
      sessionStorage.setItem('oktaRedirectCount', (redirectCount + 1).toString());

      // Parse the tokens - use a more direct approach
      try {
        // Set a flag to track if we actually processed the tokens
        let tokensProcessed = false;

        // Use a timeout to prevent handleRedirect from hanging indefinitely
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Token processing timeout')), 10000)
        );

        // Race the handleRedirect against a timeout
        await Promise.race([
          this.oktaAuth.handleRedirect().then(() => {
            tokensProcessed = true;
            console.log('[CustomCallback] handleRedirect completed successfully');
            // Log token manager state immediately after handleRedirect
            console.log('[CustomCallback] Token manager state after handleRedirect:', this.oktaAuth.tokenManager.getTokensSync());
          }),
          timeoutPromise
        ]);

        if (!tokensProcessed) {
          console.error('[CustomCallback] Token exchange timed out or failed');
          throw new Error('Token exchange timed out or failed');
        }
      } catch (error) {
        console.error('[CustomCallback] Error in handleRedirect or token processing:', error);

        // If there's an error exchanging tokens, we need to abort and reset
        sessionStorage.removeItem('oktaRedirectCount');
        this.oktaAuth.tokenManager.clear();

        // Redirect to home page to start fresh using Angular Router
        this.router.navigate(['/']); // Use router
        return;
      }

      console.log('[CustomCallback] Checking if authenticated after handleRedirect');
      console.log('[CustomCallback] Token manager state before isAuthenticated check:', this.oktaAuth.tokenManager.getTokensSync()); // Log token state before check

      // Double check we're authenticated with retries
      let isAuthenticated = false;
      for (let i = 0; i < 3; i++) {
        // Give the token manager a moment to process the tokens between checks
        await new Promise(resolve => setTimeout(resolve, 500));
        
        isAuthenticated = await this.oktaAuth.isAuthenticated();
        console.log(`[CustomCallback] isAuthenticated check attempt ${i+1}:`, isAuthenticated);
        
        if (isAuthenticated) break;
      }
      
      // Force token refresh to ensure we have the latest token state
      if (isAuthenticated) {
        try {
          // Get the tokens to ensure they're accessible
          const tokens = await this.oktaAuth.tokenManager.getTokens();
          console.log('[CustomCallback] Tokens received:', tokens ? 'Yes (tokens available)' : 'No');
          
          if (!tokens || !tokens.accessToken) {
            console.error('[CustomCallback] Token is missing despite isAuthenticated returning true');
            // Try to get a fresh token
            await this.oktaAuth.tokenManager.renew('accessToken');
            console.log('[CustomCallback] Attempted to renew access token');
          }          // Authentication successful - clear the redirect counter
          sessionStorage.removeItem('oktaRedirectCount');
          
          // Try to restore original URL or navigate to dashboard
          const originalUri = this.oktaAuth.getOriginalUri();
          console.log('[CustomCallback] Original URI to restore:', originalUri);
          
          // Clear the original URI before navigating to prevent loops
          this.oktaAuth.setOriginalUri('');
          
          // Use Angular Router to navigate to dashboard
          console.log('[CustomCallback] Authentication successful, navigating to dashboard via Angular Router');
          this.router.navigate(['/dashboard']); // Use router, no hash!
          return; // Added return to prevent further execution

        } catch (tokenError) {
          console.error('[CustomCallback] Error handling tokens:', tokenError);
          // If we can't access tokens but isAuthenticated is true, we have a problem
          // Force a fresh login by clearing everything
          await this.oktaAuth.tokenManager.clear();
          // await this.oktaAuth.signOut(); // Avoid potential redirect loop
          this.router.navigate(['/']); // Use router
        }
      } else {
        console.error('[CustomCallback] Token exchange completed but not authenticated');
        // Clear any partial auth state and redirect to home
        await this.oktaAuth.tokenManager.clear();
        // await this.oktaAuth.signOut(); // Avoid potential redirect loop
        this.router.navigate(['/']); // Use router
      }
    } catch (error) {
      console.error('[CustomCallback] Error during callback processing:', error);
      // Clear any partial auth state
      try {
        // Clear all auth state to ensure a clean slate
        await this.oktaAuth.tokenManager.clear();
        // @ts-ignore - Accessing internal API to clear transaction
        if (this.oktaAuth.transactionManager) {
          // @ts-ignore
          await this.oktaAuth.transactionManager.clear();
        }
        // await this.oktaAuth.signOut(); // Avoid potential redirect loop
      } catch (clearError) {
        console.error('[CustomCallback] Error while clearing auth state:', clearError);
      }
      this.router.navigate(['/']); // Use router
    }
  }
}
