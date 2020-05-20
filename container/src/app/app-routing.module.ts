import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContentLayoutComponent } from './layout/content-layout/content-layout.component';
import { NoAuthGuard } from './core/no-auth.guard';
import { LoginComponent } from './login/login.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'web',
    pathMatch: 'full'
  },
  {
    path: 'web',
    component: ContentLayoutComponent,
    canActivate: [NoAuthGuard],
    children: [  
      {
        path: '',
        loadChildren: () => import("./modules/main/main.module").then(m => m.MainModule)
      },    
      {
        path: 'viewer',
        loadChildren: () => import("./modules/viewer/viewer.module").then(m => m.ViewerModule)
      }
    ]
  },
  { path: 'login', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
