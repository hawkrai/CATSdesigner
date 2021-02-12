import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {SubjectNewsModule} from './modules/subject-news/subject-news.module';
import {LecturesModule} from './modules/lectures/lectures.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LabsModule} from './modules/labs/labs.module';
import {MatModule} from "./mat.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {appReducers} from "./store/reducers/app.reducer";
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {NewsEffects} from "./store/effects/news.effects";
import {GroupsEffects} from './store/effects/groups.effects';
import {DatePipe} from '@angular/common';
import {LecturesEffects} from './store/effects/lectures.effects';
import {LabsEffects} from './store/effects/labs.effects';
import {FilesModule} from './modules/files/files.module';
import {PracticalModule} from './modules/practical/practical.module';
import {SubgroupingComponent} from './components/subgrouping/subgrouping.component';
import {SubSettingsComponent} from './components/sub-settings/sub-settings.component';
import {SubjectModule} from './modules/subject/subject.module';
import { SubjectEffect } from './store/effects/subject.effects';
import { PracticalsEffects } from './store/effects/practicals.effects';
import { CatsEffects } from './store/effects/cats.effects';
import { FilesEffects } from './store/effects/files.effects';


@NgModule({
  declarations: [
    AppComponent,
    SubgroupingComponent,
    SubSettingsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SubjectNewsModule,
    BrowserAnimationsModule,
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
    StoreDevtoolsModule.instrument(),
  ],
  entryComponents: [
    SubgroupingComponent
  ],
  providers: [
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
