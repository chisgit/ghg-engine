import { FileUploadComponent } from './file-upload.component';
import { OktaAuthGuard } from '@okta/okta-angular';
import { CustomCallbackComponent } from './custom-callback.component';
import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  { 
    path: '', 
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  { 
    path: 'dashboard', 
    component: FileUploadComponent, 
    canActivate: [OktaAuthGuard]
  },
  { path: 'login/callback', component: CustomCallbackComponent }
];
// [DEBUG] appRoutes configured with CustomCallbackComponent
