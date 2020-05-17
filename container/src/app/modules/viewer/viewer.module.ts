import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewerComponent } from './pages/viewer/viewer.component';
import { SubjectComponent } from './pages/subject/subject.component';
import { ViewerRoutingModule } from './viewer.routing';
import { MatetialModule } from '../../shared/matetial/matetial.module';


@NgModule({
  declarations: [
    ViewerComponent, 
    SubjectComponent
  ]
  ,
  imports: [
    CommonModule,
    ViewerRoutingModule,
    MatetialModule
  ]
})
export class ViewerModule { }
