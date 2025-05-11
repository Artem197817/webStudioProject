import {Routes} from '@angular/router';
import {LayoutComponent} from './shared/components/layout/layout.component';


export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {path: '', loadComponent: () => import('./shared').then(m => m.MainComponent)},
      {path: 'article/:url', loadComponent: () => import('./shared').then(m => m.ArticleComponent)},
      {path: 'login', loadComponent: () => import('./user').then(m => m.LoginComponent)},
      {path: 'signup', loadComponent: () => import('./user').then(m => m.SignupComponent)},
      {path: 'user-agreement', loadComponent: () => import('./user').then(m => m.UserAgreementComponent)},
      {path: 'blog', loadComponent: () => import('./shared').then(m => m.BlogComponent)},
    ]
  }
];
