import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { NavbarComponent } from './navbar/navbar.component';
import { LectorsComponent } from './lectors/lectors.component';
import { LectorModalComponent } from './modal/lector-modal/lector-modal.component';
import { GroupComponent } from './group/group.component';
import { AddGroupComponent } from './modal/add-group/add-group.component';
import { StudentsComponent } from './students/students.component';
import { ResetThePasswordComponent } from './reset-the-password/reset-the-password.component';
import { DeleteItemComponent } from './modal/delete-person/delete-person.component';
import { EditLectorComponent } from './modal/edit-lector/edit-lector.component';

import {MatCardModule} from '@angular/material/card';
import { GoogleChartsModule } from 'angular-google-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule, MatButtonModule, MatToolbarModule, MatInputModule, MatTableModule,
   MatPaginatorModule, MatAutocompleteModule, MatChipsModule } from '@angular/material';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatMenuModule} from '@angular/material/menu';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSortModule} from '@angular/material/sort';
import {MatSliderModule} from '@angular/material/slider';
import {MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS} from '@angular/material/dialog';
import {MatCheckboxModule, MAT_CHECKBOX_CLICK_ACTION} from '@angular/material/checkbox';
import {MatProgressSpinnerModule} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from '../../app-routing.module';
import { FilesComponent } from './files/files.component';
import { AdminGenerateComponent } from './admin-generate/admin-generate.component';
import { SubjectListComponent } from './modal/subject-list/subject-list.component';
import { ListOfGroupsComponent } from './modal/list-of-groups/list-of-groups.component';
import { ListOfStudentsComponent } from './modal/list-of-students/list-of-students.component';
import { EditStudentComponent } from './modal/edit-student/edit-student.component';
import { MessagesComponent } from './messages/messages.component';
import { SendMessageComponent } from './modal/send-message/send-message.component';
import { MatTabsModule, MAT_TABS_CONFIG } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { StatisticComponent } from './modal/statistic/statistic.component';
import { ProfileComponent } from './profile/profile.component';
import { MatListModule } from '@angular/material/list';
import { MessageDetailComponent } from './modal/message-detail/message-detail.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import {ActiveStatsComponent} from './active-stats/active-stats.component';

@NgModule({
  declarations: [
    NavbarComponent,
    LectorsComponent,
    LectorModalComponent,
    GroupComponent,
    AddGroupComponent,
    ActiveStatsComponent,
    StudentsComponent,
    ResetThePasswordComponent,
    DeleteItemComponent,
    EditLectorComponent,
    FilesComponent,
    AdminGenerateComponent,
    SubjectListComponent,
    ListOfGroupsComponent,
    ListOfStudentsComponent,
    EditStudentComponent,
    MessagesComponent,
    SendMessageComponent,
    StatisticComponent,
    ProfileComponent,
    MessageDetailComponent,
  ],
  imports: [
    MatListModule,
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatSortModule,
    MatIconModule,
    MatToolbarModule,
    MatSelectModule,
    MatFormFieldModule,
    MatMenuModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatDialogModule,
    MatCheckboxModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    AppRoutingModule,
    MatProgressSpinnerModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatExpansionModule,
    GoogleChartsModule,
    MatCardModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatTooltipModule
  ],
  entryComponents: [LectorModalComponent, AddGroupComponent,
    DeleteItemComponent, EditLectorComponent, SubjectListComponent, ListOfGroupsComponent,
    ListOfStudentsComponent, EditStudentComponent, SendMessageComponent, StatisticComponent, MessageDetailComponent ],
  providers: [{provide: MAT_CHECKBOX_CLICK_ACTION, useValue: 'check'},
  {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {}},
  { provide: MAT_TABS_CONFIG, useValue: { animationDuration: '200ms' } }],
  exports: [
    NavbarComponent,
    LectorsComponent,
    LectorModalComponent,
    GroupComponent, AddGroupComponent,
    ActiveStatsComponent,
    AddGroupComponent,
    StudentsComponent,
    ResetThePasswordComponent,
    DeleteItemComponent,
    EditLectorComponent,
    SendMessageComponent,
    StatisticComponent,
    ProfileComponent,
    MessageDetailComponent
  ]
})
export class AdminModule {}
