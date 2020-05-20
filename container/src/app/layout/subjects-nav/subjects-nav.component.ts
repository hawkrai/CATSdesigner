import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { LayoutService } from "../layout.service";
import { CoreService } from "../../core/services/core.service";
import { Subject } from "../../core/models/subject";
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-subjects-nav',
  templateUrl: './subjects-nav.component.html',
  styleUrls: ['./subjects-nav.component.less']
})
export class SubjectsNavComponent implements OnInit {
  opened:boolean;
  subjects: Subject[]
  selectedSubject: Subject;

  constructor(private layouService: LayoutService, private coreService: CoreService) {}

  ngOnInit(): void {
    var that = this;
    this.coreService.getSubjects().subscribe((subjects) => {
      that.subjects = subjects;
      if(that.subjects.length > 0) {
        that.selectedSubject = that.subjects[0]
      }
    });

  }

}
