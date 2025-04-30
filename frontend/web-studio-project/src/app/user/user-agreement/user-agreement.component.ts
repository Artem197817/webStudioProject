import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-user-agreement',
  standalone:true,
  imports: [RouterLink],
  templateUrl: './user-agreement.component.html',
  styleUrl: './user-agreement.component.scss'
})
export class UserAgreementComponent implements OnInit{
 protected currentDate =  new Date().toLocaleDateString('ru-RU');
protected isReadDocument = false;

  constructor(private authService: AuthService,
              private router: Router
              ){
  }
ngOnInit(): void {
 this.isReadDocument = this.authService.documentSignal();
} 
changedReadDocument(){
  this.isReadDocument = !this.isReadDocument;
}
acceptAgreement(){
  this.authService.acceptAgreementSignal.set(true);
  this.router.navigate(['/signup']);
}
}
