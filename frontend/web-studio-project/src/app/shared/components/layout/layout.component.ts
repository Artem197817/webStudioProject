import { Component } from '@angular/core';
import {HeaderComponent} from '../header/header.component';
import {FooterComponent} from '../footer/footer.component';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-layout',
  imports: [
    HeaderComponent,
    FooterComponent,
    RouterOutlet,
  ],
  standalone: true,
  templateUrl: './layout.component.html',
})
export class LayoutComponent {

}
