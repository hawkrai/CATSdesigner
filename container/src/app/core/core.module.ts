import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { NoAuthGuard } from './no-auth.guard'
import { NoAuthGuardAdmin } from './no-auth-admin.guard'
import { HttpClientModule } from '@angular/common/http'
import { UserAssignedToSubjectGuard } from './guards/user-assigned-to-subject.guard'
import { UserLecturerGuard } from './guards/user-lecturer.guard'

@NgModule({
  declarations: [],
  imports: [CommonModule, HttpClientModule],
  providers: [
    NoAuthGuard,
    NoAuthGuardAdmin,
    UserAssignedToSubjectGuard,
    UserLecturerGuard,
  ],
})
export class CoreModule {}
