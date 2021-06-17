import { Component, OnInit } from '@angular/core';
import { CoreService } from '../core/services/core.service';
import { Group } from '../core/models/group';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HelpPopoverProgressControlComponent } from './help-popover-progress-control/help-popover-progress-control.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-progress-control',
  templateUrl: './progress-control.component.html',
  styleUrls: ['./progress-control.component.less']
})
export class ProgressControlComponent implements OnInit {
  controlForm: FormGroup;
  selectedGroup: SafeResourceUrl;
  isLoad: boolean = false;

  constructor(private coreService: CoreService,  private formBuilder: FormBuilder, private sanitizer: DomSanitizer,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.selectedGroup = this.sanitizer.bypassSecurityTrustResourceUrl(`/control/main/0`);
    this.controlForm = this.formBuilder.group({
      groupName: ['', Validators.  required]
    }); 
  }

  get f() { return this.controlForm.controls; }
  
  enterGroup(): void {
    this.selectedGroup = this.sanitizer.bypassSecurityTrustResourceUrl(`/control/main/${this.f.groupName.value}`);
    this.isLoad = true;
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
