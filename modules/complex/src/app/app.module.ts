import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'
import { DatePipe } from '@angular/common'
import { StoreModule } from '@ngrx/store'
import { EffectsModule } from '@ngrx/effects'
import { StoreDevtoolsModule } from '@ngrx/store-devtools'

import { appReducers } from './store/reducers/app.reducers'
import { AppComponent } from './app.component'
import { LoginComponent } from './login/login.component'
import { ComplexGridModule } from './complexGrid/complexGrid.module'
import { ComplexMaterialModule } from './complexMaterial/complexMaterial.module'
import { AppRoutingModule } from './app-routing.module'
import { MatModule } from './mat.module'
import { FilesEffects } from './store/effects/files.effects'

@NgModule({
  declarations: [AppComponent, LoginComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    StoreModule.forRoot(appReducers),
    StoreDevtoolsModule.instrument(),
    EffectsModule.forRoot([FilesEffects]),
    MatModule,
    AppRoutingModule,
    ComplexMaterialModule,
    ComplexGridModule,
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent],
})
export class AppModule {}
