import { Component, OnInit } from '@angular/core';
import {Percentage} from '../../models/percentage.model';
import {PercentagesService} from '../../services/percentages.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-percentages',
  templateUrl: './percentages.component.html',
  styleUrls: ['./percentages.component.less']
})
export class PercentagesComponent implements OnInit {

  private COUNT = 1000;
  private PAGE = 1;

  private percentages: Percentage[];

  private subjectId: string;

  constructor(private percentagesService: PercentagesService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.subjectId = this.route.snapshot.params.subjectId;
    this.retrievePercentages();
  }

  retrievePercentages() {
    this.percentagesService.getPercentages({
      count: this.COUNT,
      page: this.PAGE,
      filter: '{"subjectId":"' + this.subjectId + '"}',
    })
      .subscribe(res => this.percentages = res.Items);
  }

}
