import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContentLayoutComponent } from './layout/content-layout/content-layout.component';
import { NoAuthGuard } from './core/no-auth.guard';


const routes: Routes = [
  {
    path: 'viewer',
    component: ContentLayoutComponent,
    canActivate: [NoAuthGuard],
    children: [
      {
        path: '',
        loadChildren: () => import("./modules/viewer/viewer.module").then(m => m.ViewerModule)
      },
      {
        path: 'subject',
        loadChildren: () => import("./modules/viewer/viewer.module").then(m => m.ViewerModule)
      }
    ] 

  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
