import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, MatInputModule, NgIf],
  template: `
    <mat-card style="max-width: 400px; margin: 24px auto;">
      <h2>File Upload</h2>
      <input type="file" (change)="onFileSelected($event)" accept=".csv,.txt" style="margin-bottom: 12px;" />
      <div *ngIf="selectedFile as file" style="margin-top: 10px;">
        <mat-icon color="primary">attach_file</mat-icon>
        <strong>Selected File:</strong> {{ file.name }}
      </div>
      <button mat-raised-button color="primary" style="margin-top: 16px;" [disabled]="!selectedFile">
        Upload
      </button>
    </mat-card>
  `,
  styles: []
})
export class FileUploadComponent {
  selectedFile: File | null = null;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      console.log('File selected:', this.selectedFile);
    }
  }
}
