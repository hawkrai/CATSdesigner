import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminModule } from './modules/adminPanel/admin.modal';
import { LoginModule } from './modules/login/login.module';
import { ControlModule } from './control/control.module';
import { HttpClientModule } from '@angular/common/http';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SignupModule } from './modules/signup/signup.module';
import {MatCardModule} from '@angular/material/card';
import { MatButtonModule, MatIconModule, MatDialogModule, MatFormFieldModule, MatCheckboxModule,
  MatInputModule, MatSelectModule } from '@angular/material';
import { ChangePasswordComponent } from './modules/change-password/change-password.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ResetPasswordModalComponent } from './modules/reset-password-modal/reset-password-modal.component';
import {MessageComponent} from './component/message/message.component';
import * as dataRu from './translate/translations_ru.json';
import * as dataEn from './translate/translations_en.json';
import {TranslateModule, TranslatePipe} from 'educats-translate';
import { ToastrModule } from 'ngx-toastr';
import { VideoComponent } from './modules/modal/video.component';

@NgModule({
  declarations: [
    AppComponent,
    MessageComponent,
    ChangePasswordComponent,
    ResetPasswordModalComponent,
    VideoComponent,
  ],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    AdminModule,
    LoginModule,
    ControlModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    BrowserAnimationsModule,
    SignupModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatInputModule,
    MatSelectModule,
    TranslateModule.forRoot({
      localizationMap: {
        ru: dataRu,
        en: dataEn
      }
    }),
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right'
    })
  ],
  entryComponents: [MessageComponent, ChangePasswordComponent, ResetPasswordModalComponent, VideoComponent],
  providers: [TranslatePipe],
  bootstrap: [AppComponent]
})
export class AppModule {}
