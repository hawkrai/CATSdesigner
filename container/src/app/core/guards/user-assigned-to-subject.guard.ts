import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CoreService } from '../services/core.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class UserAssignedToSubjectGuard implements CanActivate {
  constructor(
    private coreService: CoreService,
    private router: Router
) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : Observable<boolean> | boolean {

    const subjectId = +route.paramMap.get('id');
    if (Number.isNaN(subjectId)) {
        return false;
    }
    return this.coreService.isUserAssignedToSubject(subjectId).pipe(
        map((isAssigned) => {
            if (!isAssigned) {
                this.router.navigate(['web', 'viewer', 'main']);
                return false;
            }
            return true;
        })
    );
  }

}