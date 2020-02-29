import {Component, Input, OnInit} from '@angular/core';
import {PercentageResult} from '../../../models/percentage-result.model';

@Component({
  selector: 'app-percentage-results-list',
  templateUrl: './percentage-results-list.component.html',
  styleUrls: ['./percentage-results-list.component.less']
})
export class PercentageResultsListComponent implements OnInit {

  @Input() percentageResults: PercentageResult[];

  constructor() { }

  ngOnInit() {
  }

}
