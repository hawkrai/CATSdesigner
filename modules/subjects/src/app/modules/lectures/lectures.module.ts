import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {LecturesComponent} from './lectures.component';
import {LecturesListComponent} from './components/lectures-list/lectures-list.component';
import {VisitLecturesComponent} from './components/visit-lectures/visit-lectures.component';
import {MatModule} from '../../mat.module';
import {LecturePopoverComponent} from './components/lecture-popover/lecture-popover.component';
import {SharedModule} from '../../shared/shared.module';
import { VisitDateLecturesPopoverComponent } from './components/visit-lectures/visit-date-lectures-popover/visit-date-lectures-popover.component'


@NgModule({
  declarations: [
    VisitDateLecturesPopoverComponent,
    LecturesComponent, LecturesListComponent, VisitLecturesComponent, LecturePopoverComponent],
  imports: [
    MatModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule
  ],
  entryComponents: [
    LecturePopoverComponent,
    VisitDateLecturesPopoverComponent
  ],
  exports: [LecturesComponent, LecturesListComponent, VisitLecturesComponent]
})
export class LecturesModule {
}
