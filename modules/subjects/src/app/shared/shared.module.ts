import { FirstLetterUppercasePipe } from './pipes/first-letter-uppercase.pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FilterPipe} from './filter.pipe/filter.pipe';



@NgModule({
  declarations: [
    FilterPipe,
    FirstLetterUppercasePipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    FilterPipe,
    FirstLetterUppercasePipe,
    CommonModule
  ]
})
export class SharedModule { }
