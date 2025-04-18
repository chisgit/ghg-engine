import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router'; 
import { OktaAuthGuard } from '@okta/okta-angular';
import { AppComponent } from './app/app.component';
import { appRoutes } from './app/app.routes';
import { oktaAuth } from './app/okta.config';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideOktaAuth } from './app/providers/okta-auth.provider';

// Clear any existing auth transactions before bootstrapping the app,
// but ONLY if we are NOT on the callback route.
// This helps prevent the warning: "a saved auth transaction exists in storage"
// without interfering with the PKCE flow.
if (!window.location.pathname.startsWith('/login/callback')) { // Added condition
  try {
    console.log('[Main] Checking for existing auth transactions (not on callback)');
    // @ts-ignore - Accessing internal API to check transaction state
    if (oktaAuth.transactionManager && oktaAuth.transactionManager.exists()) {
      console.log('[Main] Existing auth transaction found, clearing before app initialization');
      // @ts-ignore - Accessing internal API to clear transaction
      oktaAuth.transactionManager.clear();
    }
  } catch (error) {
    console.warn('[Main] Error checking/clearing transaction:', error);
  }
} else {
  console.log('[Main] Skipping transaction check/clear on callback route');
}


bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(appRoutes), 
    provideHttpClient(withInterceptorsFromDi()),
    provideOktaAuth(oktaAuth),
    OktaAuthGuard
  ]
}).catch(err => console.error(err));
