import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';

import { AppComponent } from './app.component';
import { LoginComponent } from "./login/login.component";
import { ComplexGridModule } from "./complexGrid/complexGrid.module";
import { ComplexMaterialModule } from "./complexMaterial/complexMaterial.module";
import { AppRoutingModule } from './app-routing.module';
import { MatModule } from "./mat.module";



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatModule,
    AppRoutingModule,
    ComplexMaterialModule,
    ComplexGridModule
  ],
  providers: [
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
