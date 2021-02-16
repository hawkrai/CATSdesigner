import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from './services/auth.service';
import { of, Observable } from 'rxjs';
import { map, catchError, } from 'rxjs/operators';

@Injectable()
export class NoAuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : Observable<boolean> {
    const currentUser = this.authenticationService.currentUserValue;
    let isAut: Boolean = true;
    return this.authenticationService.check()
    .pipe(
      map(response => {
        this.authenticationService.setCurrentUserValue(response);
        if(response.role == 'admin'){
          this.redirectAdmin();
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
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});  
  }

  redirectAdmin() {
    this.router.navigate(['/adminPanel']);  
  }
}
