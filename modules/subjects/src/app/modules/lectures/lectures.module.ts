import {NgModule} from '@angular/core';
import {LecturesComponent} from './lectures.component';
import {LecturesListComponent} from './components/lectures-list/lectures-list.component';
import {VisitLecturesComponent} from './components/visit-lectures/visit-lectures.component';
import {MatModule} from '../../mat.module';
import {LecturePopoverComponent} from './components/lecture-popover/lecture-popover.component';
import {FormsModule} from '@angular/forms';
import {SharedModule} from '../../shared/shared.module';

@NgModule({
  declarations: [LecturesComponent, LecturesListComponent, VisitLecturesComponent, LecturePopoverComponent],
  imports: [
    MatModule,
    FormsModule,
    SharedModule
  ],
  entryComponents: [
    LecturePopoverComponent
  ],
  exports: [LecturesComponent, LecturesListComponent, VisitLecturesComponent]
})
export class LecturesModule {
}
