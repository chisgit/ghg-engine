import { FileUploadComponent } from './file-upload.component';
import { OktaAuthGuard, OktaCallbackComponent } from '@okta/okta-angular';

export const appRoutes = [
  { path: '', component: FileUploadComponent, canActivate: [OktaAuthGuard] },
  { path: 'login/callback', component: OktaCallbackComponent }
];
// [DEBUG] appRoutes configured with OktaAuthGuard and OktaCallbackComponent
