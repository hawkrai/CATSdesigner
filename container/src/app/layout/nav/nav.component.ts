import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../layout.service';
import { AuthenticationService } from '../../core/services/auth.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.less']
})
export class NavComponent implements OnInit {
  public isLector: boolean;
  constructor(private layoutService: LayoutService, private autService: AuthenticationService) { }

  ngOnInit(): void {
    this.isLector = this.autService.currentUserValue.role == "lector";
  }

  sidenavAction() {
    this.layoutService.toggle();
  }

  logOut() {
    this.autService.logout().pipe(first()).subscribe(
      response => {
          location.reload();
      });;
  }

}
