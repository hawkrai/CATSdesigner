import { Component, OnInit } from '@angular/core';
import { SubjectService } from 'src/app/service/subject.service';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'src/app/model/subject.response';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})

export class StatsComponent implements OnInit {

  subjects: Subject[];
  isLoad = false;
  groupId: any;
  selectedItem: any;

  constructor(private subjectService: SubjectService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.groupId = this.route.snapshot.params.groupId;
    this.getSubjectName(this.groupId);
  }

  getSubjectName(groupId) {
    this.subjectService.getSubjects(groupId).subscribe(subjectResponse => {
      this.subjects = subjectResponse.Subjects;
      this.isLoad = true;
    });
  }
}
