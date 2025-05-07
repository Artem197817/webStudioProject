import {ApplicationConfig, importProvidersFrom, provideZoneChangeDetection} from '@angular/core';
import {RouterModule} from '@angular/router';
import { routes } from './app.routes';
import {provideAnimations} from '@angular/platform-browser/animations';
import {provideHttpClient,  withInterceptors} from '@angular/common/http';
import {authInterceptor} from './core/auth/auth-fn.intercepptor';
import {MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule} from '@angular/material/snack-bar';
import { provideEnvironmentNgxMask } from 'ngx-mask';


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimations(),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideEnvironmentNgxMask(),
    importProvidersFrom(
      RouterModule.forRoot(routes, {
      onSameUrlNavigation: 'reload',
      anchorScrolling: 'enabled',
      scrollPositionRestoration: 'enabled'
      })),
    importProvidersFrom(MatSnackBarModule),
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: { duration: 2500 }
    }
]
};

