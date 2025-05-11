import {Component, OnInit} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../../core/auth/auth.service';

@Component({
  selector: 'app-user-agreement',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './user-agreement.component.html',
  styleUrl: './user-agreement.component.scss'
})
export class UserAgreementComponent implements OnInit {
  protected currentDate = new Date().toLocaleDateString('ru-RU');
  protected isReadDocument = false;

  constructor(private authService: AuthService,
              private router: Router
  ) {
  }

  public ngOnInit(): void {
    this.isReadDocument = this.authService.documentSignal();
  }

  protected changedReadDocument() {
    this.isReadDocument = !this.isReadDocument;
  }

  protected acceptAgreement() {
    this.authService.acceptAgreementSignal.set(true);
    this.router.navigate(['/signup']);
  }
}
