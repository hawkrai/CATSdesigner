import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FilterPipe} from './pipes/filter.pipe';
import { PluarPipe } from './pipes/pluar.pipe';



@NgModule({
  declarations: [
    FilterPipe,
    PluarPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    FilterPipe,
    PluarPipe
  ]
})
export class SharedModule { }
