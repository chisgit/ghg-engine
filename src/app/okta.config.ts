import { OktaAuth, type OktaAuthOptions } from '@okta/okta-auth-js';

export const oktaConfig: OktaAuthOptions = {
  issuer: 'https://dev-43296795.okta.com/oauth2/default',
  clientId: '0oao52hsldb6anYgg5d7',
  redirectUri: window.location.origin + '/login/callback',
  scopes: ['openid', 'profile', 'email'],
  pkce: true,
};

export const oktaAuth = new OktaAuth(oktaConfig);
