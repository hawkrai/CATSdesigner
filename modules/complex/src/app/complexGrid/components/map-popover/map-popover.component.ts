import { Component, OnInit, Inject } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { ComplexService } from '../../../service/complex.service'
import { DialogData } from '../../../models/DialogData'

import { AngularD3TreeLibService } from 'angular-d3-tree'

@Component({
  selector: 'map-popover',
  templateUrl: './map-popover.component.html',
  styleUrls: ['./map-popover.component.less'],
})
export class MapPopoverComponent implements OnInit {
  chartData: any[]
  elementId: string

  constructor(
    public dialogRef: MatDialogRef<MapPopoverComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private treeService: AngularD3TreeLibService,
    private complexService: ComplexService
  ) {
    this.complexService.getConceptTree(data.id).subscribe((res) => {
      this.chartData = res.result
    })
  }

  ngOnInit() {
    console.log(this.treeService)
  }

  onNoClick(): void {
    this.dialogRef.close()
  }

  selectedNode: any

  nodeUpdated(node: any) {
    console.info('app detected node change')
  }
  nodeSelected(node: any) {
    console.info('app detected node selected', node)
    this.selectedNode = node
  }
}
