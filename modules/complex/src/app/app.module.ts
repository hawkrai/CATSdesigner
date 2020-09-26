import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

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
    HttpClientModule,
    MatModule,
    AppRoutingModule,
    ComplexMaterialModule,
    ComplexGridModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
