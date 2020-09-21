import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NavbarStatisticComponent } from './navbar-statistic/navbar-statistic.component';
import { AppRoutingModule } from '../../app-routing.module';
import { SearchGroupComponent } from './modal/search-group/search-group.component';
import { FormsModule } from '@angular/forms';
import {MatDialogModule, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule, MatButtonModule, MatToolbarModule, MatInputModule, MatTableModule, MatPaginatorModule } from '@angular/material';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatMenuModule} from '@angular/material/menu';
import { ItemComponent } from './item/item.component';
import { GeneralComponent } from './general/general.component';
import { ItemTableComponent } from './item/item-table/item-table.component';
import { StatsComponent } from './stats/stats.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { GroupNotFoundComponent } from './group-not-found/group-not-found.component';
import { TableForStatsSubjectComponent } from './stats/table-for-stats-subject/table-for-stats-subject.component';

@NgModule({
  declarations: [
    NavbarStatisticComponent,
    SearchGroupComponent,
    ItemComponent,
    GeneralComponent,
    ItemTableComponent,
    StatsComponent,
    GroupNotFoundComponent,
    TableForStatsSubjectComponent
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
    MatMenuModule,
    MatProgressSpinnerModule
  ],
  providers: [{ provide: MAT_DIALOG_DATA, useValue: [] }],
  bootstrap: [],
  exports: [ NavbarStatisticComponent, SearchGroupComponent ],
  entryComponents: [ SearchGroupComponent]
})
export class ControlModule {}
