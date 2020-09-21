import {Component, Input, OnInit} from '@angular/core';
import {VisitStats} from '../../../models/visit-stats.model';
import {Consultation} from '../../../models/consultation.model';
import {VisitStatsComponent} from '../visit-stats.component';

@Component({
  selector: 'app-visit-stats-list',
  templateUrl: './visit-stats-list.component.html',
  styleUrls: ['./visit-stats-list.component.less']
})
export class VisitStatsListComponent implements OnInit {

  @Input() visitStatsList: VisitStats[];
  @Input() consultations: Consultation[];

  constructor(private visitStatsComponent: VisitStatsComponent) {
  }

  ngOnInit() {
  }

}
