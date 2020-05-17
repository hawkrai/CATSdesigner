import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoAuthGuard } from './no-auth.guard'
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule

  ],
  providers:[
    NoAuthGuard
  ]
})
export class CoreModule { }
