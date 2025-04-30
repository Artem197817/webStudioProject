import { Routes } from '@angular/router';
import {LayoutComponent} from './shared/components/layout/layout.component';
import {MainComponent} from './shared/components/main/main.component';
import {ArticleComponent} from './shared/components/article/article.component';
import { LoginComponent } from './user/login/login.component';
import { SignupComponent } from './user/signup/signup.component';
import { UserAgreementComponent } from './user/user-agreement/user-agreement.component';

export const routes: Routes = [
  {path: '',
    component: LayoutComponent,
    children: [
      {path: '', component: MainComponent},
      {path: 'article/:url', component: ArticleComponent},
      {path: 'login', component: LoginComponent},
      {path: 'signup', component: SignupComponent},
      {path: 'user-agreement', component: UserAgreementComponent},
    ]}
];

//   {path: '',loadChildren: ()=>import('./views/user/user.module').then(m => m.UserModule), canActivate: [authForwardGuard]},
//   {path: '',loadChildren: ()=>import('./views/product/product.module').then(m => m.ProductModule)},
//   {path: '',loadChildren: ()=>import('./views/personal/personal.module').then(m => m.PersonalModule), canActivate: [authGuard]},
