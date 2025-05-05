import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter, withRouterConfig} from '@angular/router';
import { routes } from './app.routes';
import {provideAnimations} from '@angular/platform-browser/animations';
import {provideHttpClient, HTTP_INTERCEPTORS, withInterceptors} from '@angular/common/http';
import {authInterceptor} from './core/auth/auth-fn.intercepptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withRouterConfig({
        onSameUrlNavigation: 'reload',
      })
    ),
    provideAnimations(),
    provideHttpClient(withInterceptors([authInterceptor])),

]
};
/**     importProvidersFrom(
 RouterModule.forRoot(routes, {
 onSameUrlNavigation: 'reload',
 anchorScrolling: 'enabled',
 scrollPositionRestoration: 'enabled'
 })*/
