import {Component, Input, OnInit} from '@angular/core';
import {Percentage} from '../../../models/percentage.model';

@Component({
  selector: 'app-percentages-list',
  templateUrl: './percentages-list.component.html',
  styleUrls: ['./percentages-list.component.less']
})
export class PercentagesListComponent implements OnInit {

  @Input() percentages: Percentage[];

  constructor() { }

  ngOnInit() {
  }

}
