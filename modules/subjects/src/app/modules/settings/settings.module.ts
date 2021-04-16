import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings.component';
import { SubdivisionComponent } from './components/subdivision/subdivision.component';
import { MatModule } from 'src/app/mat.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [SettingsComponent, SubdivisionComponent],
  imports: [
    CommonModule,
    MatModule,
    SharedModule,
    FormsModule
  ],
  entryComponents: [
    SubdivisionComponent
  ]
})
export class SettingsModule { }
