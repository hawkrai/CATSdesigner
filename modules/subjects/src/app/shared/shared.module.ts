import { VarDirective } from './directives/var.directive';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';

import {FilterPipe} from './pipes/filter.pipe';
import { PluarPipe } from './pipes/pluar.pipe';
import { MatModule } from '../mat.module';
import { FirstLetterUppercasePipe } from './pipes/first-letter-uppercase.pipe';
import { ToColumnPipe } from './pipes/to-column.pipe';
import { FlatpickrModule } from 'angularx-flatpickr';
import { FileUploaderComponent } from './components/file-uploader/file-uploader.component';
import { LoaderComponent } from './components/loader/loader.component';

@NgModule({
  declarations: [
    FilterPipe,
    FirstLetterUppercasePipe,
    PluarPipe,
    VarDirective,
    ToColumnPipe,
    FileUploaderComponent,
    LoaderComponent
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
    FileUploaderComponent
  ]
})
export class SharedModule { }
