import {Component, OnInit} from '@angular/core';
import {Router, RouterLink, RouterModule} from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { MENU_ITEMS } from '../../../constants';
import { UserType } from '../../../types/user.types';
import { DefaultResponseType } from '../../../types/default-response.types';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    RouterModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit{

  protected headerMenuList = MENU_ITEMS;
  protected isLogged: boolean = false;
  protected userInfo: UserType | null = null;
  protected isModal: boolean = false;
  private timeoutId: any;

constructor(private authService: AuthService,
            private router: Router,
            private _snackBar: MatSnackBar){}

  ngOnInit(): void {
    this.authService.isLogged$.subscribe(isLoggedIn => {
      this.isLogged = isLoggedIn;
      if(this.isLogged){
        this.authService.getUserInfo()
        .subscribe((data: UserType | DefaultResponseType) => {
          if ((data as DefaultResponseType).error !== undefined) {
            throw new Error((data as DefaultResponseType).message);
          }
          this.userInfo = data as UserType;
        })
      }
    })
  }


  loginNavigate(): void {
    if(!this.isLogged){
      this.router.navigate(['/login']);
    }else{
      this.isModal = !this.isModal;
      clearTimeout(this.timeoutId);
      this.timeoutId = setTimeout(() => {
        this.isModal = !this.isModal;
      }, 3000);
    }
  }

  logout(): void {
    this.authService.logout()
      .subscribe({
        next: (data: DefaultResponseType) => {
          this.doLogout()

        },
        error: (err: HttpErrorResponse) => {
          this.doLogout()
        }
      })
  }

  private doLogout(): void {
    this.authService.removeTokens();
    this.authService.userId = null;
    this._snackBar.open('Вы разлогинены')
    this.router.navigate(['/'])
  }

  activateMenuItem(id: number){
    this.headerMenuList.forEach(menuItem => {
      menuItem.isActive = false;
      if(menuItem.id === id){
        menuItem.isActive = true;
      }
    })
  }
}
