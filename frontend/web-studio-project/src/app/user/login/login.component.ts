import {Component} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
import { AuthService } from '../../core/auth/auth.service';
import { LoginResponseType } from '../../types/login-response.type';
import { DefaultResponseType } from '../../types/default-response.types';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
     ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  protected loginForm: FormGroup;
  protected passwordVisible: boolean = false;

  constructor(private fb: FormBuilder,
              private router: Router,
              private authService: AuthService,
              readonly snackBar: MatSnackBar,) {

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false],
    });

  }

  protected login(): void {
    if (this.loginForm.valid && this.loginForm.value.email && this.loginForm.value.password) {
      this.authService.login(this.loginForm.value.email, this.loginForm.value.password, !!this.loginForm.value.rememberMe)
        .subscribe(
          {
            next: (data: LoginResponseType | DefaultResponseType) => {
              let error = null;
              if ((data as DefaultResponseType).error !== undefined) {
                error = (data as DefaultResponseType).message;
              }
              const loginResponse = data as LoginResponseType;

              if (!loginResponse.accessToken
                || !loginResponse.refreshToken
                || !loginResponse.userId) {
                error = 'Ошибка авторизации';
              }
              if (error) {
                this.snackBar.open(error);
                throw new Error(error)
              }
              this.authService.setTokens(loginResponse.accessToken, loginResponse.refreshToken);
              this.authService.userId = loginResponse.userId;

              this.snackBar.open('Добро пожаловать');
              this.router.navigate(['/']);

            },
            error: (err: HttpErrorResponse) => {
              if (err.error && err.error.message) {
                this.snackBar.open(err.error.message);
              } else {
                this.snackBar.open('Ошибка авторизации');
              }
            }
          })
    }
  }
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
}
