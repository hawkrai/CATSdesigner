import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FilterPipe} from './pipes/filter.pipe';
import { PluarPipe } from './pipes/pluar.pipe';
import { ContentHostDirective } from './directives/content-host.directive';



@NgModule({
  declarations: [
    FilterPipe,
    PluarPipe,
    ContentHostDirective
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
