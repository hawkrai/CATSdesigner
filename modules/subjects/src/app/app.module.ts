import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {SubjectNewsModule} from './modules/subject-news/subject-news.module';
import {LecturesModule} from './modules/lectures/lectures.module';
import {SideMenuComponent} from './components/side-menu/side-menu.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LabsModule} from './modules/labs/labs.module';
import {DeletePopoverComponent} from "./shared/delete-popover/delete-popover.component";
import {MatModule} from "./mat.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {appReducers} from "./store/reducers/app.reducer";
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {NewsEffects} from "./store/effects/news.effects";
import {GroupsEffects} from './store/effects/groups.effects';
import {VisitDatePopoverComponent} from './shared/visit-date-popover/visit-date-popover.component';
import {DatePipe} from '@angular/common';
import {LecturesEffects} from './store/effects/lectures.effects';
import {LabsEffects} from './store/effects/labs.effects';
import {VisitingPopoverComponent} from './shared/visiting-popover/visiting-popover.component';
import {FileDownloadPopoverComponent} from './shared/file-download-popover/file-download-popover.component';
import {FilesModule} from './modules/files/files.module';
import {PracticalModule} from './modules/practical/practical.module';
import {SubgroupingComponent} from './components/subgrouping/subgrouping.component';
import {SubSettingsComponent} from './components/sub-settings/sub-settings.component';
import {SubjectModule} from './modules/subject/subject.module';
import {CheckPlagiarismPopoverComponent} from './shared/check-plagiarism-popover/check-plagiarism-popover.component';
import {LecturesListComponent} from './modules/lectures/components/lectures-list/lectures-list.component';
import {VisitLecturesComponent} from './modules/lectures/components/visit-lectures/visit-lectures.component';
import { SubjectEffect } from './store/effects/subject.effects';
import { PracticalsEffects } from './store/effects/practicals.effects';
import { CatsEffects } from './store/effects/cats.effects';
import { FilesEffects } from './store/effects/files.effects';

@NgModule({
  declarations: [
    AppComponent,
    SideMenuComponent,
    DeletePopoverComponent,
    VisitDatePopoverComponent,
    VisitingPopoverComponent,
    FileDownloadPopoverComponent,
    SubgroupingComponent,
    SubSettingsComponent,
    CheckPlagiarismPopoverComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    SubjectNewsModule,
    LecturesModule,
    LabsModule,
    MatModule,
    FormsModule,
    FilesModule,
    SubjectModule,
    PracticalModule,
    ReactiveFormsModule,
    StoreModule.forRoot(appReducers),
    EffectsModule.forRoot([NewsEffects, GroupsEffects, LecturesEffects, LabsEffects, SubjectEffect, PracticalsEffects, CatsEffects, FilesEffects]),
    StoreDevtoolsModule.instrument()
  ],
  entryComponents: [
    DeletePopoverComponent,
    VisitDatePopoverComponent,
    VisitingPopoverComponent,
    FileDownloadPopoverComponent,
    SubgroupingComponent,
    CheckPlagiarismPopoverComponent,
    LecturesListComponent,
    VisitLecturesComponent
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule {
}
