import {NgModule} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatDialogModule} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';
import {MatSelectModule} from '@angular/material/select';
import {MatTableModule} from '@angular/material/table';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule, MatRippleModule} from '@angular/material/core';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatRadioModule} from '@angular/material/radio';
import {MatTabsModule} from '@angular/material/tabs';

@NgModule({
  exports: [
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatSidenavModule,
    MatToolbarModule,
    MatDividerModule,
    MatListModule,
    MatSelectModule,
    MatTableModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatSlideToggleModule,
    MatRippleModule,
    MatGridListModule,
    MatRadioModule,
    MatTabsModule
  ]
})
export class MatModule { }
