import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoAuthGuard } from './no-auth.guard'



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers:[
    NoAuthGuard
  ]
})
export class CoreModule { }
