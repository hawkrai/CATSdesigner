import { PluckPipe } from './pipes/pluck.pipe';
import { UniquePipe } from './pipes/unique.pipe';
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
import { InitialsPipe } from './pipes/initials.pipe';
import { OrderByPipe } from './pipes/order-by.pipe';

@NgModule({
  declarations: [
    FilterPipe,
    FirstLetterUppercasePipe,
    PluarPipe,
    VarDirective,
    ToColumnPipe,
    FileUploaderComponent,
    LoaderComponent,
    VisitDatePopoverComponent,
    UniquePipe,
    PluckPipe,
    InitialsPipe,
    OrderByPipe
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
    VisitDatePopoverComponent,
    UniquePipe,
    PluckPipe,
    InitialsPipe,
    OrderByPipe
  ]
})
export class SharedModule { }
