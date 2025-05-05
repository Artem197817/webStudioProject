import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';
import {SharedUtilInfoService} from '../../utils/shared-util-info.service';
import { OrderService } from '../../services/order.service';

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

  constructor(private orderService: OrderService){}

  activePopup(){
    this.orderService.openPopup('consultation');
    console.log('activePopup')
  }
}
