import { Component,  Inject, OnInit } from '@angular/core'
import { Group } from '../../../../app/models/Group'
import { GroupService } from '../../../service/group.service'
import { DialogData } from '../../../models/DialogData'
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import {MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material/dialog'
import {MonitoringTreeComponent} from '../monitoring-tree/monitoring-tree.component'
import { select, Store } from '@ngrx/store'
import { IAppState } from '../../../store/states/app.state'
import { getSubjectId } from '../../../store/selectors/subject.selector'
import { Student } from 'src/app/models/student.model'

@Component({
  selector: 'app-students-monitoring',
  templateUrl: 'students-monitoring.component.html',
  styleUrls: ['students-monitoring.component.less']
})
export class StudentsMonitoringComponent implements OnInit {
  students: Student[]
  selectedStudentId: number
  groups: Group[]
  selected: Group
  subjectId: string
  complexId: string
  isLecturer: boolean
  userId: string
  showMonitoring: boolean = false; 

  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private store: Store<IAppState>,
    private groupService: GroupService
) {
    this.complexId = data.id
    this.userId = data.model
    const user = JSON.parse(localStorage.getItem('currentUser'))
    
    this.isLecturer = user.role === 'lector'
  }

  openMonitoringStudent(): void {
    const dialogData: DialogData = {
      model: this.selectedStudentId,
      id: this.complexId
    }
    const dialogConfig = new MatDialogConfig()
    dialogConfig.width = '100%'
    dialogConfig.data = dialogData
    dialogConfig.maxWidth='none'

    const dialogRef = this.dialog.open(MonitoringTreeComponent, dialogConfig
    )

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed')
    })
  }
  getStudents(groupId: string){
    this.groupService.getStudentsByGroup(groupId).subscribe((students) => {
      this.students = students
    })
  }
  onOptionsSelected() {
    this.getStudents(this.selected.Id)
  }

  onSelectStudent(userId: number): void {
    if (userId) {
      this.selectedStudentId = userId;
    } else {
      this.selectedStudentId = 0;
      this.showMonitoring = false;
    }
  }

  ngOnInit() {
    this.store.pipe(select(getSubjectId)).subscribe((subjectId) => {
      this.subjectId = subjectId
      this.groupService.getGroups(this.subjectId).subscribe((gr) => {
        this.groups = gr
        this.selected = this.groups[0]
        this.getStudents(this.selected.Id)
      })
    })
  }
}