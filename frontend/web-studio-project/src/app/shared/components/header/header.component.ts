import {Component, OnInit} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { MENU_ITEMS } from '../../../constants';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit{

  protected headerMenuList = MENU_ITEMS;
  protected isLogged: boolean = false;

constructor(private authService: AuthService,
            private router: Router){}

  ngOnInit(): void {
    this.isLogged = this.authService.getisLoggedIn();
  }


  loginNavigate(): void {
    if(!this.isLogged){
      this.router.navigate(['/login']);
    }
  }
}
