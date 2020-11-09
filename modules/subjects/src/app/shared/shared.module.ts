import { VarDirective } from './directives/var.directive';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';

import {FilterPipe} from './pipes/filter.pipe';
import { PluarPipe } from './pipes/pluar.pipe';
import { FirstLetterUppercasePipe } from './pipes/first-letter-uppercase.pipe';
import { ToColumnPipe } from './pipes/to-column.pipe';

@NgModule({
  declarations: [
    FilterPipe,
    FirstLetterUppercasePipe,
    PluarPipe,
    VarDirective,
    ToColumnPipe
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    FilterPipe,
    PluarPipe,
    FirstLetterUppercasePipe,
    CommonModule,
    VarDirective,
    ToColumnPipe
  ]
})
export class SharedModule { }
