import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';

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
  protected headerMenuList = [
    {title: 'Услуги', link: '/', fragment: 'services'},
    {title: 'О нас', link: '/about', fragment: 'about'},
    {title: 'Статьи', link: '/article', fragment: ''},
    {title: 'Отзывы', link: '/', fragment: 'reviews'},
    {title: 'Контакты', link: '/', fragment: 'contact'},
  ]
  protected isLogged: boolean = false;
}
