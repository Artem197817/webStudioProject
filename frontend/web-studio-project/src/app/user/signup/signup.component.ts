import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {HttpErrorResponse} from '@angular/common/http';
import { DefaultResponseType } from '../../types/default-response.types';
import { AuthService } from '../../core/auth/auth.service';
import { LoginResponseType } from '../../types/login-response.type';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent implements OnInit{

  protected signupForm: FormGroup;

  
  constructor(private fb: FormBuilder,
              private router: Router,
              private authService: AuthService,
              readonly snackBar: MatSnackBar,) {

    this.signupForm = this.fb.group({
      name:['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$')]],
      agree: [false, Validators.requiredTrue],
    });
  }

  ngOnInit(): void {
    this.signupForm.get('agree')?.setValue(this.authService.acceptAgreementSignal());
  }

  private passwordMatchValidator(formGroup: FormGroup): ValidationErrors | null {
    const password = formGroup.get('password')?.value;
    const passwordRepeat = formGroup.get('passwordRepeat')?.value;

    if (password !== passwordRepeat) {
      formGroup.get('passwordRepeat')?.setErrors({passwordMismatch: true});
      return {passwordMismatch: true};
    } else {
      formGroup.get('passwordRepeat')?.setErrors(null);
      return null;
    }
  }

  protected signup(): void {
    if (this.signupForm.valid && this.signupForm.value.email && this.signupForm.value.password && this.signupForm.value.passwordRepeat) {
      this.authService.signup(this.signupForm.value.email, this.signupForm.value.password, this.signupForm.value.passwordRepeat)
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
                error = 'Ошибка регистрации';
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
                this.snackBar.open('Ошибка регистрации');
              }
            }
          })
    }
  }
readDocument(signal: boolean){
  this.authService.documentSignal.set(signal);
  this.router.navigate(['/user-agreement']);
}


}