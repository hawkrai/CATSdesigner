import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PdfViewerModule } from 'ng2-pdf-viewer'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatModule } from '../mat.module'
import { MatSnackBarModule } from '@angular/material'
import { MaterialsPopoverComponent } from './components/materials/materials-popover/materials-popover.component'
import { MonitoringPopoverComponent } from './components/materials/monitoring-popover/monitoring-popover.component'
import { MaterialComponent } from './components/materials/materials.component'
import { ComplexMaterialComponent } from './complexMaterial.component'
import { AppRoutingModule } from '../app-routing.module'
import { TestExecutionComponent } from './components/materials/adaptiveLearningTests/adaptive-learning-test.component'
import { QuestionComponent } from './components/materials/adaptiveLearningTests/components/question/question.component'
import { AddMaterialPopoverComponent } from './components/materials/add-material-popover/add-material-popover.component'
import { AdaptivePopupComponent } from './components/materials/adaptiveLearningPopup/adaptivePopup.component'
import { MenuItemComponent } from './components/materials/add-material-popover/components/menu/nav-menu.component'
import { FileUploaderComponent } from './components/materials/add-material-popover/components/file-uploader/file-uploader.component'
import { LoaderComponent } from './components/materials/add-material-popover/components/loader/loader.component'
import { VarDirective } from './components/materials/add-material-popover/directives/var.directive'
import * as dataRu from '../core/translate/translations_ru.json'
import * as dataEn from '../core/translate/translations_en.json'
import { TranslateModule, TranslatePipe } from 'educats-translate'
import { NotificationPopoverComponent } from "./components/materials/notification-popover/notification-popover.component"
import { HelpComponent } from "../help/help.component";
import { PopoverModule } from 'ngx-smart-popover'
import { DeleteConfirmationPopupComponent } from './components/materials/delete-confirmation-popup/delete-confirmation-popup.component'
import {PopoverDialogComponent} from './components/materials/popover-dialog/popover-dialog.component'
import { FileComponent } from './components/materials/add-material-popover/components/file/file.component'
import { FileViewerComponent } from './components/materials/add-material-popover/components/file-viewer/file-viewer.component'

@NgModule({
  declarations: [
    FileComponent,
    FileViewerComponent,
    MaterialComponent,
    ComplexMaterialComponent,
    MaterialsPopoverComponent,
    AddMaterialPopoverComponent,
    MonitoringPopoverComponent,
    TestExecutionComponent,
    QuestionComponent,
    MenuItemComponent,
    FileUploaderComponent,
    LoaderComponent,
    VarDirective,
    AdaptivePopupComponent,
    NotificationPopoverComponent,
    HelpComponent,
    DeleteConfirmationPopupComponent,
    PopoverDialogComponent,
  ],
  imports: [
    MatSnackBarModule,
    CommonModule,
    MatModule,
    AppRoutingModule,
    PdfViewerModule,
    FormsModule,
    ReactiveFormsModule,
    PopoverModule,
    TranslateModule.forRoot({
      localizationMap: {
        ru: dataRu,
        en: dataEn,
      },
    }),
  ],
  providers: [TranslatePipe],
  exports: [VarDirective, PopoverModule],
  entryComponents: [
    FileViewerComponent,
    FileComponent,
    MaterialsPopoverComponent,
    MonitoringPopoverComponent,
    AddMaterialPopoverComponent,
    AdaptivePopupComponent,
    DeleteConfirmationPopupComponent,
    NotificationPopoverComponent,
  ],
})
export class ComplexMaterialModule {}
