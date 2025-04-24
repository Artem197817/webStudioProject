import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';

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
  protected footerMenuList = [
    {title: 'Услуги', link: '/', fragment: 'services'},
    {title: 'О нас', link: '/about', fragment: 'about'},
    {title: 'Статьи', link: '/article', fragment: ''},
    {title: 'Отзывы', link: '/', fragment: 'reviews'},
    {title: 'Контакты', link: '/', fragment: 'contact'},
  ]
  protected isCall: boolean = false;
}
