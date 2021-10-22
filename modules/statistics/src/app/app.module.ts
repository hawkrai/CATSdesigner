import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainPageComponent } from './main-page/main-page.component';
import {ChartsModule, ThemeService} from 'ng2-charts';
import { NgApexchartsModule } from 'ng-apexcharts';
import {HttpClientModule} from '@angular/common/http';
import {TranslatePipe} from '../../../../container/src/app/pipe/translate.pipe';


@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    TranslatePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ChartsModule,
    NgApexchartsModule,
    HttpClientModule,
  ],
  providers: [ThemeService, TranslatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
