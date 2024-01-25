import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { ComplexGridComponent } from './complexGrid/complexGrid.component'
import { ComplexMaterialComponent } from './complexMaterial/complexMaterial.component'

const path = {
  empty: '',
  complex: 'complex',
  main: 'main',
  complexMaterial: 'cMaterial',
}

const routes: Routes = [
  {
    path: path.empty,
    redirectTo: path.main,
    pathMatch: 'full',
  },
  {
    path: path.complex,
    redirectTo: path.main,
    pathMatch: 'full',
  },
  { path: path.main, component: ComplexGridComponent },
  { path: path.complexMaterial, component: ComplexMaterialComponent },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
