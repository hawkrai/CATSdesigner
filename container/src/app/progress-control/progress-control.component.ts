import { Component, OnInit } from '@angular/core';
import { CoreService } from '../core/services/core.service';
import { Group } from '../core/models/group';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-progress-control',
  templateUrl: './progress-control.component.html',
  styleUrls: ['./progress-control.component.less']
})
export class ProgressControlComponent implements OnInit {
  controlForm: FormGroup;
  selectedGroup: SafeResourceUrl;
  isLoad: boolean = false;
  constructor(private coreService: CoreService,  private formBuilder: FormBuilder, private sanitizer: DomSanitizer) { }

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

}
