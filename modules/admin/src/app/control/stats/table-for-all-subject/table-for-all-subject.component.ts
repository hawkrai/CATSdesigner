import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'app-table-for-all-subject',
  templateUrl: './table-for-all-subject.component.html',
  styleUrls: ['./table-for-all-subject.component.css'],
})
export class TableForAllSubjectComponent implements OnInit {
  displayedColumns: string[] = ['position', 'surname', 'omissions', 'rating']
  headerRow: string[] = [
    'family-header',
    'option-header',
    'subject-header-row0',
  ]
  dataSource = ELEMENT_DATA

  constructor() {}

  ngOnInit() {}
}

export interface PeriodicElement {
  surname: string
  position: number
  omissions: number
  rating: string
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, surname: 'Hydrogen', omissions: 1.0079, rating: 'H' },
  { position: 2, surname: 'Helium', omissions: 4.0026, rating: 'He' },
]
