import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatModule } from '../mat.module';
import { MaterialsPopoverComponent } from './components/materials/materials-popover/materials-popover.component';
import { MonitoringPopoverComponent } from './components/materials/monitoring-popover/monitoring-popover.component';
import { MaterialComponent } from './components/materials/materials.component';
import { ComplexMaterialComponent } from './complexMaterial.component';
import { MenuComponent } from './components/materials/menu/menu.component';
import { AppRoutingModule } from '../app-routing.module';

@NgModule({
    declarations: [
      MaterialComponent,
      ComplexMaterialComponent,
      MaterialsPopoverComponent,
      MonitoringPopoverComponent,
      MenuComponent
    ],
    imports: [
      CommonModule,
      MatModule,
      AppRoutingModule,
      PdfViewerModule,
      FormsModule,
      ReactiveFormsModule
  ],
  entryComponents: [
    MaterialsPopoverComponent,
    MonitoringPopoverComponent
  ]
})
export class ComplexMaterialModule{ }
