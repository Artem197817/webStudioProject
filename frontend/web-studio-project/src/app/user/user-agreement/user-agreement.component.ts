import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-agreement',
  imports: [RouterLink],
  templateUrl: './user-agreement.component.html',
  styleUrl: './user-agreement.component.scss'
})
export class UserAgreementComponent {
  currentDate =  new Date().toLocaleDateString('ru-RU');

  constructor(){

  }
}
