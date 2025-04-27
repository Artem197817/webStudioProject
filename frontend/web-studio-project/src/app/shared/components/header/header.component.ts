import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {SharedUtilInfoService} from '../../utils/shared-util-info.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  protected headerMenuList = SharedUtilInfoService.menuItems;
  protected isLogged: boolean = false;
}
