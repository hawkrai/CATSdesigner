import { SharedModule } from './../../shared/shared.module';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LecturesComponent} from './lectures.component';
import {LecturesListComponent} from './components/lectures-list/lectures-list.component';
import {VisitLecturesComponent} from './components/visit-lectures/visit-lectures.component';
import {MatModule} from '../../mat.module';
import {LecturePopoverComponent} from './components/lecture-popover/lecture-popover.component';
import {FormsModule} from '@angular/forms';
import {DragDropModule} from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [LecturesComponent, LecturesListComponent, VisitLecturesComponent, LecturePopoverComponent],
  imports: [
    MatModule,
    FormsModule,
    DragDropModule,
    SharedModule
  ],
  entryComponents: [
    LecturePopoverComponent
  ],
  exports: [LecturesComponent, LecturesListComponent, VisitLecturesComponent]
})
export class LecturesModule {
}
