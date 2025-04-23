import { Routes } from '@angular/router';
import {LayoutComponent} from './shared/components/layout/layout.component';
import {MainComponent} from './shared/components/main/main.component';

export const routes: Routes = [
  {path: '',
    component: LayoutComponent,
    children: [
      {path: '', component: MainComponent},
    ]}
];

//   {path: '',loadChildren: ()=>import('./views/user/user.module').then(m => m.UserModule), canActivate: [authForwardGuard]},
//   {path: '',loadChildren: ()=>import('./views/product/product.module').then(m => m.ProductModule)},
//   {path: '',loadChildren: ()=>import('./views/personal/personal.module').then(m => m.PersonalModule), canActivate: [authGuard]},
