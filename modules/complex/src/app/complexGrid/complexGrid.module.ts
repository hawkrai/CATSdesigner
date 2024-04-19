import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { MatModule } from '../mat.module'
import { PdfViewerModule } from 'ng2-pdf-viewer'
import { ComplexGridComponent } from './complexGrid.component'
import { GridMenuComponent } from './components/menu/grid-menu.component'
import { ComplexGridEditPopupComponent } from './components/edit-popup/edit-popup.component'
import { ComplexRulesPopoverComponent } from './components/complex-rules-popover/complex-rules-popover.component'
import { MainLoaderComponent } from './components/loader/main-loader.component'
import { AngularD3TreeLibModule } from 'angular-d3-tree'
import { MapPopoverComponent } from './components/map-popover/map-popover.component'
import { AppRoutingModule } from '../app-routing.module'
import { DeleteConfirmationPopupComponent } from './components/delete-confirmation-popup/delete-confirmation-popup.component'
import {PopoverDialogComponent} from './components/popover-dialog/popover-dialog.component'

import * as dataRu from '../core/translate/translations_ru.json'
import * as dataEn from '../core/translate/translations_en.json'
import { TranslateModule, TranslatePipe } from 'educats-translate'

@NgModule({
  declarations: [
    ComplexGridComponent,
    GridMenuComponent,
    ComplexGridEditPopupComponent,
    ComplexRulesPopoverComponent,
    MainLoaderComponent,
    MapPopoverComponent,
    DeleteConfirmationPopupComponent,
    PopoverDialogComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    PdfViewerModule,
    AngularD3TreeLibModule,
    MatModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      localizationMap: {
        ru: dataRu,
        en: dataEn,
      },
    }),
  ],
  providers: [TranslatePipe],
  entryComponents: [
    ComplexGridEditPopupComponent,
    ComplexRulesPopoverComponent,
    MapPopoverComponent,
    DeleteConfirmationPopupComponent,
  ],
})
export class ComplexGridModule {}
