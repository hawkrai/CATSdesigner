import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatModule } from '../mat.module';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ComplexGridComponent } from "./complexGrid.component";
import { GridMenuComponent } from './components/menu/grid-menu.component'
import { ComplexGridEditPopupComponent } from './components/edit-popup/edit-popup.component';
import { ComplexRulesPopoverComponent } from './components/complex-rules-popover/complex-rules-popover.component';
import { MainLoaderComponent } from './components/loader/main-loader.component';
import { AngularD3TreeLibModule } from 'angular-d3-tree';
import { MapPopoverComponent } from './components/map-popover/map-popover.component';
import { AppRoutingModule } from '../app-routing.module';

@NgModule({
  declarations: [
    ComplexGridComponent,
    GridMenuComponent,
    ComplexGridEditPopupComponent,
    ComplexRulesPopoverComponent,
    MainLoaderComponent,
    MapPopoverComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    PdfViewerModule,
    AngularD3TreeLibModule,
    MatModule,
    AppRoutingModule
  ],
  entryComponents: [
    ComplexGridEditPopupComponent,
    ComplexRulesPopoverComponent,
    MapPopoverComponent
  ]
})
export class ComplexGridModule { }
