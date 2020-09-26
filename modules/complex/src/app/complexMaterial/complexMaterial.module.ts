import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { MatModule } from '../mat.module';
import { MaterialsPopoverComponent } from './components/materials/materials-popover/materials-popover.component';
import { MaterialComponent } from './components/materials/materials.component';
import { ComplexMaterialComponent } from './complexMaterial.component';
import { MenuComponent } from './components/materials/menu/menu.component';
import { AppRoutingModule } from '../app-routing.module';

@NgModule({
    declarations: [
      MaterialComponent,
      ComplexMaterialComponent,
      MaterialsPopoverComponent,
      MenuComponent
    ],
    imports: [
      CommonModule,
      MatModule,
      AppRoutingModule,
      PdfViewerModule
  ],
  entryComponents: [
    MaterialsPopoverComponent
  ]
})
export class ComplexMaterialModule{ }
