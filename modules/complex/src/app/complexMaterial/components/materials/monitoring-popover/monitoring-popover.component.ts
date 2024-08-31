import { Component, OnInit, Inject } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { select, Store } from '@ngrx/store'
import { IAppState } from '../../../../store/states/app.state'
import { getSubjectId } from '../../../../store/selectors/subject.selector'
import { FormControl, Validators } from '@angular/forms'
import { ComplexService } from '../../../../service/complex.service'
import { GroupService } from '../../../../service/group.service'
import { Group } from '../../../../models/Group'
import { DialogData } from '../../../../models/DialogData'
import { ConceptMonitoring } from 'src/app/models/ConceptMonitoring'

/**
 * @title Basic use of `<table mat-table>`
 */
@Component({
  selector: 'table-basic-example',
  styleUrls: ['monitoring-popover.component.less'],
  templateUrl: 'monitoring-popover.component.html',
})
export class MonitoringPopoverComponent implements OnInit {
  displayedColumns: string[] = ['name', 'seconds']
  groupControl = new FormControl('', Validators.required)
  groups: Group[]
  estimatedSeconds: string
  estimatedMinutes: string
  dataSource: ConceptMonitoring[]
  subjectId
  selected: Group

  constructor(
    public dialogRef: MatDialogRef<MonitoringPopoverComponent>,
    private complexService: ComplexService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private store: Store<IAppState>,
    private groupService: GroupService
  ) {}

  ngOnInit() {
    this.store.pipe(select(getSubjectId)).subscribe((subjectId) => {
      this.subjectId = subjectId
      this.groupService.getGroups(this.subjectId).subscribe((gr) => {
        this.groups = gr
        this.selected = this.groups[0]
        this.complexService
          .getConceptMonitoring(this.data.nodeId, this.selected.Id)
          .subscribe((res) => {
            this.dataSource = res.ConceptMonitorings
            this.estimatedSeconds = res.EstimatedSeconds
            this.estimatedMinutes = res.EstimatedMinutes
          })
      })
    })
  }

  onNoClick(): void {
    this.dialogRef.close()
  }

  onOptionsSelected() {
    this.complexService
      .getConceptMonitoring(this.data.nodeId, this.selected.Id)
      .subscribe((res) => {
        this.dataSource = res.ConceptMonitorings
        this.estimatedSeconds = res.EstimatedSeconds
        this.estimatedMinutes = res.EstimatedMinutes
      })
  }
}
