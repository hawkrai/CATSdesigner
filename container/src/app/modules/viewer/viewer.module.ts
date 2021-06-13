import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewerComponent } from './pages/viewer/viewer.component';
import { SubjectComponent } from './pages/subject/subject.component';
import { ViewerRoutingModule } from './viewer.routing';
import { MatetialModule } from '../../shared/matetial/matetial.module';
import { SubjectsComponent } from './pages/subjects/subjects.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    ViewerComponent, 
    SubjectComponent, 
    SubjectsComponent
  ]
  ,
  imports: [
    CommonModule,
    SharedModule,
    ViewerRoutingModule,
    MatetialModule,
  ]
})
export class ViewerModule { }
