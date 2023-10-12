import { Component, Input, OnInit } from '@angular/core'
import { StudentPercentageResults } from '../../../models/student-percentage-results.model'
import { PercentageGraph } from '../../../models/percentage-graph.model'
import { PercentageResultsComponent } from '../percentage-results.component'

@Component({
  selector: 'app-percentage-results-list',
  templateUrl: './percentage-results-list.component.html',
  styleUrls: ['./percentage-results-list.component.less'],
})
export class PercentageResultsListComponent implements OnInit {
  @Input() percentageResults: StudentPercentageResults[]
  @Input() percentageGraphs: PercentageGraph[]

  constructor(private percentageResultsComponent: PercentageResultsComponent) {}

  ngOnInit() {}
}
