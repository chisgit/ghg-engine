import { Component, Inject, OnInit, OnDestroy } from '@angular/core'; // Add OnDestroy
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { OktaAuthStateService, OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { Observable, Subscription } from 'rxjs'; // Add Subscription
import { filter, map, tap } from 'rxjs/operators'; // Add tap

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    MatButtonModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy { // Implement OnDestroy
  title = 'ghg-engine';
  public isAuthenticated$!: Observable<boolean>;
  private authSubscription: Subscription | null = null; // Add subscription property

  constructor(
    private _oktaStateService: OktaAuthStateService,
    @Inject(OKTA_AUTH) private _oktaAuth: OktaAuth
  ) {
    console.log('[AppComponent] Constructor'); // Log constructor
  }

  ngOnInit(): void {
    console.log('[AppComponent] ngOnInit - Setting up isAuthenticated$ observable'); // More specific log
    this.isAuthenticated$ = this._oktaStateService.authState$.pipe(
      tap(authState => {
        console.log('[AppComponent] Raw AuthState received in pipe:', authState); // Log raw auth state with context
        if (authState) {
          console.log(`[AppComponent] AuthState details: isAuthenticated=${authState.isAuthenticated}, accessToken=${!!authState.accessToken}, idToken=${!!authState.idToken}, error=${authState.error}`);
        }
      }),
      filter(authState => {
        const shouldProcess = !!authState;
        console.log(`[AppComponent] Filter result: ${shouldProcess}`); // Log filter result
        return shouldProcess;
      }),
      map(authState => {
        const isAuth = authState.isAuthenticated ?? false;
        console.log(`[AppComponent] Mapping AuthState.isAuthenticated to: ${isAuth}`); // Log mapping result
        return isAuth;
      }),
      tap(isAuthenticated => console.log('[AppComponent] Final Mapped IsAuthenticated value:', isAuthenticated)) // Log final mapped value
    );

    // Also subscribe directly to log changes
    console.log('[AppComponent] Subscribing to isAuthenticated$'); // Log subscription action
    this.authSubscription = this.isAuthenticated$.subscribe(isAuth => {
      console.log('[AppComponent] isAuthenticated$ emitted value in subscription:', isAuth); // Log emitted value
    });

    // Log initial state check immediately
    console.log('[AppComponent] Performing initial isAuthenticated check...'); // Log initial check action
    this._oktaAuth.isAuthenticated().then(isAuth => {
       console.log('[AppComponent] Initial isAuthenticated check result:', isAuth); // Log initial check result
       // Also check token manager state here
       console.log('[AppComponent] Initial token manager state:', this._oktaAuth.tokenManager.getTokensSync());
    });
  }

  ngOnDestroy(): void { // Implement ngOnDestroy
    console.log('[AppComponent] ngOnDestroy');
    this.authSubscription?.unsubscribe(); // Clean up subscription
  }

  public async signIn(): Promise<void> {
    console.log('[AppComponent] signIn called'); // Log signIn
    // Clear any existing transaction data before starting a new flow
    this._oktaAuth.transactionManager.clear(); 
    await this._oktaAuth.signInWithRedirect();
  }

  public async signOut(): Promise<void> {
    console.log('[AppComponent] signOut called'); // Log signOut
    // Clear any existing transaction data before signing out
    this._oktaAuth.transactionManager.clear();
    // Clear token storage and sign out
    await this._oktaAuth.tokenManager.clear();
    await this._oktaAuth.signOut();
  }
}
