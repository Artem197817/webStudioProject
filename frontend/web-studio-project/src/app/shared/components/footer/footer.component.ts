import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';
import { OrderService } from '../../services/order.service';
import { MENU_ITEMS } from '../../../constants';

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
  protected footerMenuList = MENU_ITEMS;
  protected isCall: boolean = false;

  constructor(private orderService: OrderService){}

  activePopup(){
    this.orderService.openConsultationPopup();

  }
}
