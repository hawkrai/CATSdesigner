import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { LayoutService } from "../layout.service";
import { CoreService } from "../../core/services/core.service";
import { Subject } from "../../core/models/subject";
import { map } from 'rxjs/operators';
import { AuthenticationService } from './../../core/services/auth.service';
@Component({
  selector: 'app-subjects-nav',
  templateUrl: './subjects-nav.component.html',
  styleUrls: ['./subjects-nav.component.less']
})
export class SubjectsNavComponent implements OnInit {
  opened:boolean;
  subjects: Subject[];
  public isLector:boolean = false;

  constructor(private layouService: LayoutService, public coreService: CoreService, private router: Router, private autService: AuthenticationService) {}

  ngOnInit(): void {
    this.isLector = this.autService.currentUserValue.role == "lector";
    this.coreService.getSubjects().subscribe((subjects) => {
      this.subjects = subjects;
      if(this.subjects.length > 0) {
        let urls = this.router.url.split('/');
        let subjectId = 0;
        subjectId = + urls[urls.length - 1].split("#")[0];           
        this.coreService.selectedSubject = this.subjects.find(element => element.Id == subjectId);
        if(this.coreService.selectedSubject) {
          console.log(subjectId);
          //that.redirectToSelected();
          this.setupLocalInfo(this.coreService.selectedSubject); 
        }
               
      }
    });
  }
  setupLocalInfo(subject: Subject): void {
    this.coreService.setCurrentSubject({ id: subject.Id, Name: subject.Name });  
  }

  changeSubject(id: number): void {   
    this.coreService.selectedSubject = this.subjects.find(element => element.Id == id);
    this.setupLocalInfo(this.coreService.selectedSubject);
    this.redirectToSelected();  
  }  

  redirectToSelected() {
    if(this.coreService.selectedSubject !== undefined && this.coreService.selectedSubject !== null){
      this.router.navigateByUrl(`/web/viewer/subject/${this.coreService.selectedSubject.Id}`);
    }      
  }

  onSubjects() {
    this.router.navigateByUrl(`web/viewer/subjects`);   
  }

}
