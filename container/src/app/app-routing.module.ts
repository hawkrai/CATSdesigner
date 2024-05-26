import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { ContentLayoutComponent } from './layout/content-layout/content-layout.component'
import { NoAuthGuard } from './core/no-auth.guard'
import { NoAuthGuardAdmin } from './core/no-auth-admin.guard'
import { LoginComponent } from './login/login.component'
import { AdminComponent } from './admin/admin.component'
import { ConfirmationComponent } from './confirmation/confirmation.component'
import { RegisterComponent } from './register/register.component'
import { ProgressControlComponent } from './progress-control/progress-control.component'
import { AboutComponent } from './about/about.component'
import { ResetComponent } from './reset/reset.component'
import { SubjectsNavComponent } from './layout/subjects-nav/subjects-nav.component'

import { StatsComponent } from './searchResults/stats/stats.component'
import { ProfileComponent } from './searchResults/profile/profile.component'
import { ChangePersonalDataComponent } from './change-personal-data/change-personal-data.component'
import { DiplomComponent } from './diplom/diplom.component'
import { StudentManualComponent } from './about-system/student-manual/student-manual.component'
import { AboutSystemComponent } from './about-system/about-system.component'
import { LectorManualComponent } from './about-system/lector-manual/lector-manual.component'

const routes: Routes = [
  {
    path: '',
    redirectTo: 'web',
    pathMatch: 'full',
  },
  {
    path: 'web',
    component: ContentLayoutComponent,
    canActivate: [NoAuthGuard],
    children: [
      {
        path: 'chat',
        loadChildren: () =>
          import('./modules/chat/chat.module').then((m) => m.ChatModule),
      },
      {
        path: '',
        loadChildren: () =>
          import('./modules/main/main.module').then((m) => m.MainModule),
      },
      {
        path: 'viewer',
        loadChildren: () =>
          import('./modules/viewer/viewer.module').then((m) => m.ViewerModule),
      },
      {
        path: 'confirmation',
        component: ConfirmationComponent,
      },

      {
        path: 'group/:groupName',
        component: StatsComponent,
      },
      {
        path: 'profile/:id',
        component: ProfileComponent,
      },
      {
        path: 'personalAccount',
        component: ChangePersonalDataComponent,
      },

      {
        path: 'diplom',
        component: DiplomComponent,
      },

      {
        path: 'about-system',
        component: AboutSystemComponent,
      },
    ],
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot', component: ResetComponent },
  { path: 'progControl', component: ProgressControlComponent },
  { path: 'nav', component: SubjectsNavComponent },
  {
    path: 'adminPanel',
    component: AdminComponent,
    canActivate: [NoAuthGuardAdmin],
  },
  { path: 'about', component: AboutComponent },
  { path: 'lector-manual', component: LectorManualComponent },
  { path: 'student-manual', component: StudentManualComponent },
]

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
