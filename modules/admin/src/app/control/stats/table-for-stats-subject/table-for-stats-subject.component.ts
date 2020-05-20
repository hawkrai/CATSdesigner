import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-table-for-stats-subject',
  templateUrl: './table-for-stats-subject.component.html',
  styleUrls: ['./table-for-stats-subject.component.css']
})
export class TableForStatsSubjectComponent implements OnInit {

  displayedColumns: string[] = ['position', 'surname', 'omissions-lecture', 'omissions-lab', 'omissions-all',
   'average-mark-lab', 'average-mark-test', 'rating'];
  headerRow: string[] = ['family-header', 'option-header', 'omissions-header', 'average-mark-header'];
  dataSource = ELEMENT_DATA;

  constructor() { }

  ngOnInit() {
  }
}

export interface PeriodicElement {
  surname: string;
  position: number;
  omissionsLecture: number;
  omissionsLab: number;
  omissionsAll: number;
  averageMarkLab: number;
  averageMarkTest: number;
  rating: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, surname: 'Hydrogen', omissionsLecture: 1.0079, omissionsLab: 1,
   omissionsAll: 1, averageMarkLab: 1, averageMarkTest: 1, rating: 'sdvf'},
  {position: 1, surname: 'Hydrogen', omissionsLecture: 1.0079, omissionsLab: 1,
  omissionsAll: 1, averageMarkLab: 1, averageMarkTest: 1, rating: 'sdvf'}
];
