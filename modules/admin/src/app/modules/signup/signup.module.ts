import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { AppRoutingModule } from '../../app-routing.module'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import {
  MatInputModule,
  MatToolbarModule,
  MatIconModule,
  MatMenuModule,
  MatSelectModule,
} from '@angular/material'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatButtonModule } from '@angular/material/button'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatCardModule } from '@angular/material/card'
import { SignupComponent } from './signup.component'
import { MatProgressSpinnerModule } from '@angular/material'
import { SharedModule } from '../../shared/shared.module'

@NgModule({
  declarations: [SignupComponent],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatMenuModule,
    MatCheckboxModule,
    MatInputModule,
    MatCardModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    SharedModule,
  ],
  providers: [],
  bootstrap: [],
  exports: [SignupComponent],
})
export class SignupModule {}
