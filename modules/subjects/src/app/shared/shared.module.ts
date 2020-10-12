import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FilterPipe} from './pipes/filter.pipe';
import { PluarPipe } from './pipes/pluar.pipe';
import { ContentHostDirective } from './directives/content-host.directive';
import {FirstCapitalPipe} from './pipes/first-capital.pipe';
import {FormsModule} from '@angular/forms';



@NgModule({
  declarations: [
    FilterPipe,
    PluarPipe,
    ContentHostDirective,
    FirstCapitalPipe
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    FilterPipe,
    PluarPipe,
    ContentHostDirective,
    FirstCapitalPipe
  ]
})
export class SharedModule { }
