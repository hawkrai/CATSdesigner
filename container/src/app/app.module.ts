import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ContentLayoutComponent } from './layout/content-layout/content-layout.component';
import { NavComponent } from './layout/nav/nav.component';
import { FooterComponent } from './layout/footer/footer.component';

import { MatetialModule } from './shared/matetial/matetial.module';

import { CoreModule } from './core/core.module';
import { SubjectsNavComponent } from './layout/subjects-nav/subjects-nav.component';
import { LayoutService } from './layout/layout.service';
import { LoginComponent } from './login/login.component';


@NgModule({
  declarations: [
    AppComponent,
    ContentLayoutComponent,
    NavComponent,
    FooterComponent,
    SubjectsNavComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatetialModule,
    CoreModule
  ],
  providers: [
    LayoutService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
