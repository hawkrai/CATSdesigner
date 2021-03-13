import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { Lab } from 'src/app/models/lab.model';

@Component({
  selector: 'app-job-protection-item',
  templateUrl: './job-protection-item.component.html',
  styleUrls: ['./job-protection-item.component.less']
})
export class JobProtectionItemComponent implements OnInit {

  constructor() { }
  @Input() labs: Lab[];
  @Input() userId: number;
  @Input() actionsTemplate: TemplateRef<any>;
  selectedLabId: number;
  ngOnInit() {
  }

}
