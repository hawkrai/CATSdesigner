import { Component, Input } from '@angular/core'
import { StudentPercentageResults } from '../../../models/student-percentage-results.model'
import { PercentageGraph } from '../../../models/percentage-graph.model'
import { PercentageResultsComponent } from '../percentage-results.component'
import { TranslatePipe } from 'educats-translate'
import { Sort } from '@angular/material'

@Component({
  selector: 'app-percentage-results-list',
  templateUrl: './percentage-results-list.component.html',
  styleUrls: ['./percentage-results-list.component.less'],
})
export class PercentageResultsListComponent {
  @Input() filteredPercentageResults: StudentPercentageResults[]
  @Input() percentageGraphs: PercentageGraph[]
  @Input() isLecturer: boolean = false

  constructor(
    private percentageResultsComponent: PercentageResultsComponent,
    public translatePipe: TranslatePipe
  ) {}

  sortData(sort: Sort) {
    this.percentageResultsComponent.sort(sort.active, sort.direction)
  }
}
