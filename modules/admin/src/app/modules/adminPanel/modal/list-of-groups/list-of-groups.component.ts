import { Component, OnInit, Inject } from '@angular/core'
import {
  MatTableDataSource,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material'
import { TranslatePipe } from 'educats-translate'
import { GroupService } from 'src/app/service/group.service'

@Component({
  selector: 'app-list-of-groups',
  templateUrl: './list-of-groups.component.html',
  styleUrls: ['./list-of-groups.component.css'],
})
export class ListOfGroupsComponent implements OnInit {
  displayedColumns: string[] = [
    'subject',
    'groups',
    'countOfStudents',
    'groupStatus',
  ]
  dataSource = new MatTableDataSource<object>()
  groupInfo
  isLoad = false

  constructor(
    public dialogRef: MatDialogRef<ListOfGroupsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private groupService: GroupService,
    private translatePipe: TranslatePipe
  ) {}

  ngOnInit() {
    this.loadInfo(this.data)
  }

  loadInfo(lectorId) {
    this.groupService
      .getListOfGroupsByLecturerId(lectorId)
      .subscribe((result) => {
        this.groupInfo = result
        this.isLoad = true
      })
  }

  getGroupStatus(status) {
    if (status == true) {
      return this.translatePipe.transform(
        'text.adminPanel.modal.listOfGroups.groupStatus.ongoing',
        'Текущий'
      )
    }
    return this.translatePipe.transform(
      'text.adminPanel.modal.listOfGroups.groupStatus.completed',
      'Завершенный'
    )
  }
}
