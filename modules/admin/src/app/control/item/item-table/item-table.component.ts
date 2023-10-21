import { Component, OnInit, Input } from '@angular/core'
import { MatTableDataSource } from '@angular/material'

@Component({
  selector: 'app-item-table',
  templateUrl: './item-table.component.html',
  styleUrls: ['./item-table.component.css'],
})
export class ItemTableComponent implements OnInit {
  displayedColumns: string[] = [
    'position',
    'theme',
    'name',
    'shortName',
    'countOfHour',
  ]
  @Input() isLab: boolean
  @Input() dataSource = new MatTableDataSource<object>()

  constructor() {}

  ngOnInit() {}
}
