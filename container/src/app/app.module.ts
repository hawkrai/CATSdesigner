import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ContentLayoutComponent } from './layout/content-layout/content-layout.component';
import { NavComponent } from './layout/nav/nav.component';
import { FooterComponent } from './layout/footer/footer.component';

import { MatetialModule } from './shared/matetial/matetial.module';
import { CoreModule } from './core/core.module';
import { SubjectsNavComponent } from './layout/subjects-nav/subjects-nav.component';
import { LayoutService } from './layout/layout.service';
import { VideoChatModule } from 'src/app/modules/video-chat/video-chat.module';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { ProgressControlComponent } from './progress-control/progress-control.component';
import { RegisterComponent } from './register/register.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { AboutComponent } from './about/about.component';
import { MatButtonModule } from '@angular/material/button';
import { ResetComponent } from './reset/reset.component';

import { ProfileComponent } from './searchResults/profile/profile.component';
import { StatsComponent } from './searchResults/stats/stats.component';
import { TableForStatsSubjectComponent } from './searchResults/stats/table-for-stats-subject/table-for-stats-subject.component';

import { ChangePersonalDataComponent } from './change-personal-data/change-personal-data.component';
import { ChangePasswordDialog } from './change-password-dialog/change-password-dialog.component';

import { ToastrModule } from 'ngx-toastr';
import { DiplomComponent } from './diplom/diplom.component';
import { AboutSystemPopoverComponent } from './about-system/about-popover/about-popover.component';
import { StudentManualComponent } from './about-system/student-manual/student-manual.component';
import { MenuService } from './core/services/menu.service';
import { HelpPopoverProgressControlComponent } from './progress-control/help-popover-progress-control/help-popover-progress-control.component';
import { AboutSystemComponent } from './about-system/about-system.component';
import { LectorManualComponent } from './about-system/lector-manual/lector-manual.component';
import { SharedModule } from './shared/shared.module';
import { OrderByPipe } from './pipe/order-by.pipe';
import {DatePipe} from '@angular/common';

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
    ProfileComponent,
    StatsComponent,
    TableForStatsSubjectComponent,
    ChangePersonalDataComponent,
    ChangePasswordDialog,
    ProfileComponent,
    StatsComponent,
    DiplomComponent,
    AboutSystemPopoverComponent,
    AboutSystemComponent,
    LectorManualComponent,
    StudentManualComponent,
    HelpPopoverProgressControlComponent,
    OrderByPipe
  ],
  imports: [
  BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatetialModule,
    CoreModule,
    MatButtonModule,
    FormsModule,
    SharedModule,
    VideoChatModule,
    MatTableModule,
    MatDialogModule,
    MatInputModule,
    MatSelectModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right'
    })
  ],
  providers: [
    LayoutService,
    MenuService,
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


