import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminModule } from './adminPanel/admin.modal';
import { LoginModule } from './login/login.module';
import { ControlModule } from './control/control.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AdminModule,
    LoginModule,
    ControlModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
