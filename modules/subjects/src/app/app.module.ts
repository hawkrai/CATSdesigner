import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SubjectNewsModule } from './modules/subject-news/subject-news.module';
import { LecturesModule } from './modules/lectures/lectures.module';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LabsModule } from './modules/labs/labs.module';
import {DeletePopoverComponent} from "./shared/delete-popover/delete-popover.component";
import {MatModule} from "./mat.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {appReducers} from "./store/reducers/app.reducers";
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import {NewsEffects} from "./store/effects/news.effects";
import {GroupsEffects} from './store/effects/groups.effects';
import {VisitDatePopoverComponent} from './shared/visit-date-popover/visit-date-popover.component';
import {DatePipe} from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    SideMenuComponent,
    DeletePopoverComponent,
    VisitDatePopoverComponent
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
    ReactiveFormsModule,
    StoreModule.forRoot(appReducers),
    EffectsModule.forRoot([NewsEffects, GroupsEffects]),
    StoreDevtoolsModule.instrument()
  ],
  entryComponents: [
    DeletePopoverComponent,
    VisitDatePopoverComponent
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
