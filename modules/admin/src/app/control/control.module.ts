import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NavbarStatisticComponent } from './navbar-statistic/navbar-statistic.component';
import { AppRoutingModule } from '../app-routing.module';
import { MainContolComponent } from './main/main.component';
import { SearchGroupComponent } from './modal/search-group/search-group.component';
import { FormsModule } from '@angular/forms';
import {MatDialogModule} from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule, MatButtonModule, MatToolbarModule, MatInputModule, MatTableModule, MatPaginatorModule } from '@angular/material';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatMenuModule} from '@angular/material/menu';

@NgModule({
  declarations: [
    NavbarStatisticComponent,
    MainContolComponent,
    SearchGroupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSelectModule,
    MatFormFieldModule,
    BrowserAnimationsModule,
    MatMenuModule
  ],
  providers: [],
  bootstrap: [],
  exports: [ NavbarStatisticComponent,
    MainContolComponent, SearchGroupComponent ],
  entryComponents: [ SearchGroupComponent]
})
export class ControlModule {}
