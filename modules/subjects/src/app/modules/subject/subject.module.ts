import { RouterModule } from '@angular/router'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SubjectComponent } from './subject.component'
import { SubjectManagementComponent } from './subject-managment/subject-management.component'
import { MatModule } from '../../mat.module'
import { FormsModule } from '@angular/forms'
import { SharedModule } from '../../shared/shared.module'
import { ColorPickerModule } from 'ngx-color-picker'
import { SubjectLectorComponent } from './subject-lector/subject-lector.component'

@NgModule({
  declarations: [
    SubjectComponent,
    SubjectManagementComponent,
    SubjectLectorComponent,
  ],
  entryComponents: [SubjectManagementComponent, SubjectLectorComponent],
  imports: [
    CommonModule,
    MatModule,
    FormsModule,
    SharedModule,
    ColorPickerModule,
    RouterModule,
  ],
  exports: [SubjectComponent],
})
export class SubjectModule {}
