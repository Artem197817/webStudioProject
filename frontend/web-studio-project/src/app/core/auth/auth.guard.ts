import {CanActivateFn} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from './auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';


export const authGuard: CanActivateFn = (route, state) => {
  const _snackBar = inject(MatSnackBar)
  const authService = inject(AuthService);
  const isLogged = authService.getisLoggedIn();
  if (!isLogged) {
    _snackBar.open('Пользователь не авторизован')
  }
  return isLogged;
};
