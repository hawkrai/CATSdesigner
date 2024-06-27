import { NestedTreeControl } from '@angular/cdk/tree'
import { Component, Inject, OnInit } from '@angular/core'
import { MatTreeNestedDataSource } from '@angular/material/tree'
import { ComplexService } from '../../../service/complex.service'
import { ConverterService } from '../../../service/converter.service'
import { Router } from '@angular/router'
import { DialogData } from '../../../models/DialogData'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { ComplexMonitoring } from 'src/app/models/ComplexMonitoring'
import { ComplexStudentMonitoring } from 'src/app/models/ComplexStudentMonitoring'

@Component({
  selector: 'app-monitoring-tree',
  templateUrl: './monitoring-tree.component.html',
  styleUrls: ['./monitoring-tree.component.less'],
})
export class MonitoringTreeComponent implements OnInit {
  complexId: string
  studentId: string
  studentName: string
  studentGroup: string
  complexName: string
  showLoader: boolean
  treeControl = new NestedTreeControl<ComplexMonitoring>((node) => node.Children)
  dataSource = new MatTreeNestedDataSource<ComplexMonitoring>()

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private complexService: ComplexService,
    public converterService: ConverterService,
    private router: Router,
  ) {
    this.complexId = data.id
    this.studentId = data.model
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false
    }
    this.router.onSameUrlNavigation = 'reload'
  }

  ngOnInit() {
    this.showLoader = true
    this.complexService.getStudentComplexMonitoringInfo(this.complexId, this.studentId).subscribe(
        (res: ComplexStudentMonitoring) => {
            // Присваиваем значения свойствам компонента
            this.studentName = res.StudentName
            this.studentGroup = res.StudentGroup
            this.complexName = res.ComplexName
            
            this.dataSource.data = res.ConceptMonitorings
            this.treeControl.dataNodes = res.ConceptMonitorings
            this.showLoader = false
            this.treeControl.expandAll()
        },
        error => {
            console.error('Ошибка при получении данных:', error);
        }
    );
}

hasChild = (_: number, node: any) => node.Children && node.Children.length > 0;
}