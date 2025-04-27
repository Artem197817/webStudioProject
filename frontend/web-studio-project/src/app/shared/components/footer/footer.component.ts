import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';
import {SharedUtilInfoService} from '../../utils/shared-util-info.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    RouterLink,
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  protected footerMenuList = SharedUtilInfoService.menuItems;
  protected isCall: boolean = false;
}
