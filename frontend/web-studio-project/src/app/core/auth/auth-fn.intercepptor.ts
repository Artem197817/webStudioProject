import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { LoaderService } from '../../shared/services/loader.service';
import { catchError, throwError, finalize, concatMap, of } from 'rxjs';
import { DefaultResponseType } from '../../types/default-response.types';
import { LoginResponseType } from '../../types/login-response.type';

export const authInterceptor: HttpInterceptorFn = (request: HttpRequest<any>, next: HttpHandlerFn) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const loaderService = inject(LoaderService);

  loaderService.show();

  const tokens = authService.getTokens();

  let authReq = request;
  if (tokens?.accessToken) {
    authReq = request.clone({
      headers: request.headers.set('x-auth', tokens.accessToken)
    });
  }

  return next(authReq).pipe(
    catchError(error => {
      if (error.status === 401 && !authReq.url.includes('/login') && !authReq.url.includes('/refresh')) {
        // Обработка 401 без switchMap - через concatMap и вложенный Observable
        return authService.refresh().pipe(
          concatMap((result: DefaultResponseType | LoginResponseType) => {
            let errorMsg = '';
            if ((result as DefaultResponseType).error !== undefined) {
              errorMsg = (result as DefaultResponseType).message;
            }
            const refreshResult = result as LoginResponseType;
            if (!refreshResult.accessToken || !refreshResult.refreshToken || !refreshResult.userId) {
              errorMsg = 'Ошибка авторизации';
            }
            if (errorMsg) {
              return throwError(() => new Error(errorMsg));
            }

            authService.setTokens(refreshResult.accessToken, refreshResult.refreshToken);

            const newReq = request.clone({
              headers: request.headers.set('x-auth', refreshResult.accessToken)
            });
            return next(newReq);
          }),
          catchError(err => {
            authService.removeTokens();
            router.navigate(['/']);
            return throwError(() => err);
          })
        );
      }
      return throwError(() => error);
    }),
    finalize(() => loaderService.hide())
  );
};

