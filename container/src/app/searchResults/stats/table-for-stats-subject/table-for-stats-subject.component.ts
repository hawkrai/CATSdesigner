import {
  Component,
  Input,
  OnInit,
  SimpleChanges,
  OnChanges,
} from '@angular/core'
import { GroupStatsStatistic } from '../../../core/models/searchResults/group.stats'

@Component({
  selector: 'app-table-for-stats-subject',
  templateUrl: './table-for-stats-subject.component.html',
  styleUrls: ['./table-for-stats-subject.component.css'],
})
export class TableForStatsSubjectComponent implements OnInit, OnChanges {
  displayedColumns: string[] = [
    'position',
    'FIO',
    'UserLabPass',
    'UserLecturePass',
    'AllPass',
    'UserAvgLabMarks',
    'UserAvgTestMarks',
    'Rating',
  ]
  headerRow: string[] = [
    'family-header',
    'option-header',
    'omissions-header',
    'average-mark-header',
  ]
  dataSource: any
  @Input() data: any

  constructor() {}

  ngOnInit() {
    this.dataSource = this.data
  }

  getGroupNameStr() {
    if (this.dataSource) {
      return this.dataSource?.length != 0
        ? 'Группа: ' + this.dataSource[0].GroupName
        : ''
    }
  }

  getSubjectNameStr() {
    if (this.dataSource) {
      return this.dataSource?.length != 0
        ? 'Предмет: ' + this.dataSource[0].Subject
        : ''
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    this.dataSource = changes.data.currentValue
  }
}
