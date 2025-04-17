import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { OktaAuthModule, OKTA_CONFIG, OktaAuthGuard } from '@okta/okta-angular';
import { AppComponent } from './app/app.component';
import { appRoutes } from './app/app.routes';
import { oktaAuth } from './app/okta.config';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(appRoutes),
    importProvidersFrom(OktaAuthModule),
    { provide: OKTA_CONFIG, useValue: { oktaAuth } },
    OktaAuthGuard
  ]
}).catch(err => console.error(err));
