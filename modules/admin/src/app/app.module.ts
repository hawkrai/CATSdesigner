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
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    AppComponent,
    MessageComponent,
    ChangePasswordComponent,
    ResetPasswordModalComponent
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
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right'
    })
  ],
  entryComponents: [MessageComponent, ChangePasswordComponent, ResetPasswordModalComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
