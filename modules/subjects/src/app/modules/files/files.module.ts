import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilesComponent } from './files.component';
import {MatModule} from '../../mat.module';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [FilesComponent],
  imports: [
    CommonModule,
    MatModule,
    SharedModule
  ]
})
export class FilesModule { }
