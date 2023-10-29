import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { ComplexGridComponent } from './complexGrid/complexGrid.component'
import { LoginComponent } from './login/login.component'
import { ComplexMaterialComponent } from './complexMaterial/complexMaterial.component'

const routes: Routes = [
  {
    path: '',
    redirectTo: 'main',
    pathMatch: 'full',
  },
  { path: 'main', component: ComplexGridComponent },
  { path: 'cMaterial', component: ComplexMaterialComponent },
  // { path: '**', component: NotFoundComponent }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
