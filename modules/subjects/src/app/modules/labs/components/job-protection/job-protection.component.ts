import {Component, Input, OnInit} from '@angular/core';
import {Group} from "../../../../models/group.model";

@Component({
  selector: 'app-job-protection',
  templateUrl: './job-protection.component.html',
  styleUrls: ['./job-protection.component.less']
})
export class JobProtectionComponent implements OnInit {

  @Input() teacher: boolean;

  constructor() { }

  ngOnInit() {
  }

}
