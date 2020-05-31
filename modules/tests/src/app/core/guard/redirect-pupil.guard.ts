import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";


@Injectable({
  providedIn: "root"
})
export class RedirectPupilGuard implements CanActivate {
  constructor(private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    const subject = JSON.parse(localStorage.getItem("currentSubject"));

    if (user.role === "lector") {
      this.router.navigate(["test-control"]);
    } else {
      return true;
    }
  }
}
