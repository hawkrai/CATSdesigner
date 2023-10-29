import { Injectable } from '@angular/core'
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router'
import { CoreService } from '../services/core.service'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { AuthenticationService } from '../services/auth.service'

@Injectable()
export class UserLecturerGuard implements CanActivate {
  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    return this.authService.currentUser.pipe(
      map((user) => {
        const isLector = user.role === 'lector'
        if (!isLector) {
          this.router.navigateByUrl('/web')
        }
        return isLector
      })
    )
  }
}
