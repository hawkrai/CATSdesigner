import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FilterPipe} from './pipes/filter.pipe';
import { PluarPipe } from './pipes/pluar.pipe';
import { ContentHostDirective } from './directives/content-host.directive';
import {FirstCapitalPipe} from './pipes/first-capital.pipe';



@NgModule({
  declarations: [
    FilterPipe,
    PluarPipe,
    ContentHostDirective,
    FirstCapitalPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    FilterPipe,
    PluarPipe,
    ContentHostDirective,
    FirstCapitalPipe
  ]
})
export class SharedModule { }
