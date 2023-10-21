import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PdfViewerModule } from 'ng2-pdf-viewer'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatModule } from '../mat.module'
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

@NgModule({
  declarations: [
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
  ],
  imports: [
    CommonModule,
    MatModule,
    AppRoutingModule,
    PdfViewerModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [VarDirective],
  entryComponents: [
    MaterialsPopoverComponent,
    MonitoringPopoverComponent,
    AddMaterialPopoverComponent,
    AdaptivePopupComponent,
  ],
})
export class ComplexMaterialModule {}
