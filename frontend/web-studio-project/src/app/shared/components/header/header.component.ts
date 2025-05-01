import {Component, OnInit} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {SharedUtilInfoService} from '../../utils/shared-util-info.service';
import { AuthService } from '../../../core/auth/auth.service';

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

  protected headerMenuList = SharedUtilInfoService.menuItems;
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
