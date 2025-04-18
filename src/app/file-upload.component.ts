import { Component, Inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CommonModule, NgIf } from '@angular/common';
import { OktaAuthStateService, OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, MatInputModule, NgIf, CommonModule],
  template: `
    <ng-container *ngIf="isAuthenticated$ | async; else loginPrompt">
      <mat-card style="max-width: 400px; margin: 24px auto;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <h2>File Upload</h2>
          <button mat-raised-button color="warn" (click)="signOut()">Logout</button>
        </div>
        <input type="file" (change)="onFileSelected($event)" accept=".csv,.txt" style="margin-bottom: 12px;" />
        <div *ngIf="selectedFile as file" style="margin-top: 10px;">
          <mat-icon color="primary">attach_file</mat-icon>
          <strong>Selected File:</strong> {{ file.name }}
        </div>
        <button mat-raised-button color="primary" style="margin-top: 16px;" [disabled]="!selectedFile">
          Upload
        </button>
      </mat-card>
    </ng-container>

    <ng-template #loginPrompt>
      <div style="text-align: center; margin-top: 100px;">
        <h2>Please log in to access the file upload</h2>
        <button mat-raised-button color="primary" (click)="signIn()">
          Login with Okta
        </button>
      </div>
    </ng-template>
  `,
  styles: []
})
export class FileUploadComponent implements OnInit {
  selectedFile: File | null = null;
  public isAuthenticated$!: Observable<boolean>;

  constructor(
    private _oktaStateService: OktaAuthStateService,
    @Inject(OKTA_AUTH) private _oktaAuth: OktaAuth
  ) {
    console.log('[DEBUG] FileUploadComponent constructed');
  }

  ngOnInit(): void {
    console.log('[DEBUG] FileUploadComponent ngOnInit');
    this.isAuthenticated$ = this._oktaStateService.authState$.pipe(
      filter(authState => {
        console.log('[DEBUG] FileUploadComponent raw auth state:', authState);
        return !!authState;
      }),
      map(authState => {
        const isAuth = authState.isAuthenticated ?? false;
        console.log('[DEBUG] FileUploadComponent isAuthenticated:', isAuth);
        return isAuth;
      })
    );
    
    // Also check using the direct method
    this._oktaAuth.isAuthenticated().then(isAuth => {
      console.log('[DEBUG] FileUploadComponent direct isAuthenticated check:', isAuth);
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      console.log('[DEBUG] File selected:', this.selectedFile);
    }
  }

  public async signIn(): Promise<void> {
    console.log('[DEBUG] FileUploadComponent signIn called');
    // Clear any existing transaction data before starting a new flow
    this._oktaAuth.transactionManager.clear();
    await this._oktaAuth.signInWithRedirect();
  }

  public async signOut(): Promise<void> {
    console.log('[DEBUG] FileUploadComponent signOut called');
    await this._oktaAuth.signOut();
  }

  logToTerminal(message: string): void {
    console.log('[TERMINAL]', message);
  }
}
