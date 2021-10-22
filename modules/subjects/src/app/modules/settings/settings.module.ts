import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings.component';
import { MatModule } from 'src/app/mat.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [SettingsComponent],
  imports: [
    CommonModule,
    MatModule,
    SharedModule,
    FormsModule
  ]
})
export class SettingsModule { }
