import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilesComponent } from './files.component';
import {MatModule} from '../../mat.module';



@NgModule({
  declarations: [FilesComponent],
  imports: [
    CommonModule,
    MatModule
  ]
})
export class FilesModule { }
