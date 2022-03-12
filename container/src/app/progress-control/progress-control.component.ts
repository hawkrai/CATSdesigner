import { Component, OnInit } from '@angular/core';
import { CoreService } from '../core/services/core.service';
import { Group } from '../core/models/group';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HelpPopoverProgressControlComponent } from './help-popover-progress-control/help-popover-progress-control.component';
import { MatDialog } from '@angular/material/dialog';
import {first} from 'rxjs/operators';
import {AuthenticationService} from '../core/services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-progress-control',
  templateUrl: './progress-control.component.html',
  styleUrls: ['./progress-control.component.less']
})
export class ProgressControlComponent implements OnInit {
  controlForm: FormGroup;
  selectedGroup: SafeResourceUrl;
  surname: SafeResourceUrl;
  url: any;
  isLoad = false;

  constructor(private coreService: CoreService, private router: Router ,  private autService: AuthenticationService,
              private formBuilder: FormBuilder, private sanitizer: DomSanitizer, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.selectedGroup = this.sanitizer.bypassSecurityTrustResourceUrl(`/control/main/0`);
    this.controlForm = this.formBuilder.group({
      groupName: ['', Validators.  required],
      surname: [''],
      start: [''],
      end: [''],
    });
  }

  get f() { return this.controlForm.controls; }

  enterGroup(): void {
    if ((this.f.start.value != '' && this.f.end.value == '') || (this.f.start.value == '' && this.f.end.value != '')){
      return;
    }
    this.url = `/control/main/${this.f.groupName.value}/${this.f.start.value}/${this.f.end.value}`;
    if (this.f.surname.value != undefined && this.f.surname.value != ''){
      this.url = `/control/main/${this.f.groupName.value}/${this.f.surname.value}/${this.f.start.value}/${this.f.end.value}`;
    }
    this.selectedGroup = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
    this.isLoad = true;
  }

  public logOut(): void {
    this.autService.logout().pipe(first()).subscribe(
      () => location.reload());
    this.router.navigate(['/login']);
  }

  showHelp(): void{

    const dialogRef = this.dialog.open(HelpPopoverProgressControlComponent,
      {
      width: '370px',
      height: '320px',
      position: {top: '2vh', left: '42vw'},
      disableClose: true,
      hasBackdrop: true,
      backdropClass: 'backdrop-help'
    });

    dialogRef.afterClosed().subscribe(result => {
    });


}

}
