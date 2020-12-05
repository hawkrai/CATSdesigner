import { VarDirective } from './directives/var.directive';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';
import { FlatpickrModule } from 'angularx-flatpickr';

import {FilterPipe} from './pipes/filter.pipe';
import { PluarPipe } from './pipes/pluar.pipe';
import { MatModule } from '../mat.module';
import { FirstLetterUppercasePipe } from './pipes/first-letter-uppercase.pipe';
import { ToColumnPipe } from './pipes/to-column.pipe';
import { FileUploaderComponent } from './components/file-uploader/file-uploader.component';
import { LoaderComponent } from './components/loader/loader.component';
import { VisitDatePopoverComponent } from './visit-date-popover/visit-date-popover.component';

@NgModule({
  declarations: [
    FilterPipe,
    FirstLetterUppercasePipe,
    PluarPipe,
    VarDirective,
    ToColumnPipe,
    FileUploaderComponent,
    LoaderComponent,
    VisitDatePopoverComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatModule,
    FlatpickrModule.forRoot()
  ],
  exports: [
    FilterPipe,
    PluarPipe,
    FirstLetterUppercasePipe,
    CommonModule,
    VarDirective,
    ToColumnPipe,
    FlatpickrModule,
    FileUploaderComponent,
    VisitDatePopoverComponent
  ]
})
export class SharedModule { }
