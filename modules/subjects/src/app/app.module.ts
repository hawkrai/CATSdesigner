import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SubjectNewsModule } from './modules/subject-news/subject-news.module';
import { LecturesModule } from './modules/lectures/lectures.module';
import { SideMenuComponent } from './components/side-menu/side-menu.component';

@NgModule({
  declarations: [
    AppComponent,
    SideMenuComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SubjectNewsModule,
    LecturesModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
