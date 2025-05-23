import {Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, Subject, throwError} from 'rxjs';

import {LoginResponseType} from '../../types/login-response.type';
import {environment} from '../../../environments/environment';
import { DefaultResponseType } from '../../types/default-response.types';
import { UserType } from '../../types/user.types';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public accessTokenKey: string = 'accessToken';
  public refreshTokenKey: string = 'refreshToken';
  public userIdKey: string = 'userId';
  public documentSignal = signal<boolean>(false);
  public acceptAgreementSignal = signal<boolean>(false);

  public isLogged$: Subject<boolean> = new Subject<boolean>();
  private isLogged: boolean = false;

  constructor(private http: HttpClient) {
    this.isLogged = !!localStorage.getItem(this.accessTokenKey);
  }

  public getisLoggedIn(): boolean {
    return this.isLogged;
  }

  login(email: string, password: string, rememberMe: boolean = false): Observable<DefaultResponseType | LoginResponseType> {
    return this.http.post<DefaultResponseType | LoginResponseType>(environment.api + 'login', {
      email,
      password,
      rememberMe,
    })
  }

  public signup(name: string, email: string, password: string): Observable<DefaultResponseType | LoginResponseType> {
    return this.http.post<DefaultResponseType | LoginResponseType>(environment.api + 'signup', {
      name,
      email,
      password,
    })
  }

  public logout(): Observable<DefaultResponseType> {
    const tokens = this.getTokens()
    if (tokens && tokens.refreshToken) {
      return this.http.post<DefaultResponseType>(environment.api + 'logout', {
        refreshToken: tokens.refreshToken,
      })
    }
    throw throwError(() => 'Can token not find')
  }

  public setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.accessTokenKey, accessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
    this.isLogged = true;
    this.isLogged$.next(true);
  }

  public removeTokens(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    this.isLogged = false;
    this.isLogged$.next(false);
  }

  public getTokens(): { accessToken: string | null, refreshToken: string | null } {
    return {
      accessToken: localStorage.getItem(this.accessTokenKey),
      refreshToken: localStorage.getItem(this.refreshTokenKey)
    };

  }

  set userId(userId: string | null) {
    if (userId) {
      localStorage.setItem(this.userIdKey, userId);
    } else {
      localStorage.removeItem(this.userIdKey);
    }
  }

  get userId(): string | null {
    return localStorage.getItem(this.userIdKey);
  }

  refresh(): Observable<DefaultResponseType | LoginResponseType> {
    const tokens = this.getTokens();
    if (tokens && tokens.refreshToken) {
      return this.http.post<DefaultResponseType | LoginResponseType>(environment.api + 'refresh', {
        refreshToken: tokens.refreshToken,
      })
    }
    throw throwError(() => 'Can token not find');
  }

  
  getUserInfo(): Observable<UserType | DefaultResponseType> {
    return this.http.get<UserType | DefaultResponseType>(environment.api + 'users')

  }
}
