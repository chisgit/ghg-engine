import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { 
  OKTA_AUTH, 
  OktaAuthStateService,
  OktaAuthGuard,
  OktaConfig,
  OKTA_CONFIG
} from '@okta/okta-angular';
import type { OktaAuth } from '@okta/okta-auth-js';

/**
 * Provides Okta authentication services in a standalone way
 * without requiring NgModules
 */
export function provideOktaAuth(oktaAuth: OktaAuth): EnvironmentProviders {
  console.log('[provideOktaAuth] Setting up Okta providers'); // Added log
  // Create a config object for OktaAuthGuard
  const oktaConfig: OktaConfig = {
    oktaAuth
  };

  return makeEnvironmentProviders([
    { provide: OKTA_AUTH, useValue: oktaAuth },
    { provide: OKTA_CONFIG, useValue: oktaConfig },
    OktaAuthStateService,
    OktaAuthGuard
  ]);
}
