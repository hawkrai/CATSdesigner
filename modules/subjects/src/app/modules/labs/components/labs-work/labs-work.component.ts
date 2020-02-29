import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {LabService} from "../../../../services/lab.service";
import {Lab} from "../../../../models/lab.model";

@Component({
  selector: 'app-labs-work',
  templateUrl: './labs-work.component.html',
  styleUrls: ['./labs-work.component.less']
})
export class LabsWorkComponent implements OnInit {

  public labsWork: Lab[];
  public displayedColumns: string[] = ['position', 'theme', 'shortName', 'clock', 'download'];

  private subjectId: string;

  constructor(private labService: LabService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.subjectId = this.route.snapshot.params.subjectId;

    this.labService.getLabWork(this.subjectId).subscribe(res => {
      this.labsWork = res;
      console.log(res);
    })
  }

}
