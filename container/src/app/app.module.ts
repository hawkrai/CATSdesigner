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
import {TranslatePipe} from "./pipe/translate.pipe";
import { CoreModule } from './core/core.module';
import { SubjectsNavComponent } from './layout/subjects-nav/subjects-nav.component';
import { LayoutService } from './layout/layout.service';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { ProgressControlComponent } from './progress-control/progress-control.component';
import { RegisterComponent } from './register/register.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { AboutComponent } from './about/about.component';
import { MatButtonModule } from '@angular/material/button';
import { ResetComponent } from './reset/reset.component';
import { ToastModule } from './toast';


@NgModule({
  declarations: [
    AppComponent,
    ContentLayoutComponent,
    NavComponent,
    FooterComponent,
    SubjectsNavComponent,
    LoginComponent,
    AdminComponent,
    ProgressControlComponent,
    RegisterComponent,
    ConfirmationComponent,
    AboutComponent,
    ResetComponent,
    TranslatePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatetialModule,
    CoreModule,
    MatButtonModule,
    ToastModule.forRoot()
  ],
  providers: [
    LayoutService,
    TranslatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


