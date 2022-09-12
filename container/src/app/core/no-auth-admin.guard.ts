import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from './services/auth.service';
import { of, Observable } from 'rxjs';
import { map, catchError, } from 'rxjs/operators';

@Injectable()
export class NoAuthGuardAdmin implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const currentUser = this.authenticationService.currentUserValue;
    const isAut = true;
    return this.authenticationService.check()
    .pipe(
      map(response => {
        this.authenticationService.setCurrentUserValue(response);
        if (response.role !== 'admin'){
            this.redirect(state);
          }
        return true;
      }),
      catchError(error => {
        this.redirect(state);
        return of(false);
      })
    );
  }

  redirect(state: RouterStateSnapshot) {
    this.router.navigate(['/login']);
  }
}
