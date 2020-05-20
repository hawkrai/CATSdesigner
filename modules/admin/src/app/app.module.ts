import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminModule } from './adminPanel/admin.modal';
import { LoginModule } from './login/login.module';
import { ControlModule } from './control/control.module';
import { HttpClientModule } from '@angular/common/http';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SignupModule } from './signup/signup.module';
import {MatCardModule} from '@angular/material/card';
import { SuccessMessageComponent } from './success-message/success-message.component';
import { MatButtonModule, MatIconModule, MatDialogModule, MatFormFieldModule, MatCheckboxModule, MatInputModule, MatSelectModule } from '@angular/material';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ResetPasswordModalComponent } from './reset-password-modal/reset-password-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    SuccessMessageComponent,
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
    MatSelectModule
  ],
  entryComponents: [SuccessMessageComponent, ChangePasswordComponent, ResetPasswordModalComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
