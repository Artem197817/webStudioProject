import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, catchError, throwError, switchMap, finalize} from 'rxjs';
import {AuthService} from './auth.service';
import {LoginResponseType} from '../../types/login-response.type';
import {Router} from '@angular/router';
import { DefaultResponseType } from '../../types/default-response.types';
import {LoaderService} from '../../shared/services/loader.service';


@Injectable({ providedIn: 'root'})
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService,
              private router: Router,
              private loaderService: LoaderService,) {
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    console.log('AuthInterceptor intercept called for URL:', request.url);
    this.loaderService.show();
    const tokens = this.authService.getTokens();
    console.log(tokens)
    if (tokens && tokens.accessToken) {
      const authReq = request.clone({
        headers: request.headers.set('x-auth', tokens.accessToken)
      })
      return next.handle(authReq)
        .pipe(
          catchError((error) => {
            if (error.status === 401 && !authReq.url.includes('/login') && !authReq.url.includes('/refresh')) {
              return this.handle401Request(authReq, next)
            }
            return throwError(() => error)
          }),
          //finalize(() => this.loaderService.hide())
        )
    }

    return next.handle(request).pipe(finalize(() => this.loaderService.hide()));
  }

  handle401Request(request: HttpRequest<any>, next: HttpHandler) {
    return this.authService.refresh()
      .pipe(
        switchMap((result: DefaultResponseType | LoginResponseType) => {
          let error = '';
          if ((result as DefaultResponseType).error !== undefined) {
            error = (result as DefaultResponseType).message;
          }
          const refreshResult = result as LoginResponseType;
          if (!refreshResult.accessToken || !refreshResult.refreshToken || !refreshResult.userId) {
            error = 'Ошибка авторизации'
          }
          if (error) {
            return throwError(() => new Error(error))
          }

          this.authService.setTokens(refreshResult.accessToken, refreshResult.refreshToken);
          const authReq = request.clone({
            headers: request.headers.set('x-auth', refreshResult.accessToken)
          });
          return next.handle(authReq);
        }),
        catchError((error) => {
          this.authService.removeTokens();
          this.router.navigate(['/'])
          return throwError(() => (error))
        })
      )
  }
}
