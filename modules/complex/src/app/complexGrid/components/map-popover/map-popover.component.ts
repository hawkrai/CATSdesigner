import { Component, OnInit, Inject } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { ComplexService } from '../../../service/complex.service'
import { DialogData } from '../../../models/DialogData'

import { AngularD3TreeLibService } from 'angular-d3-tree'

import * as d3 from 'd3'

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
  ) {}

  ngOnInit() {
    this.complexService.getConceptTree(this.data.id).subscribe((res) => {
      this.chartData = res.result
      const treeModel = this.treeService.treeModel
      treeModel.nodeWidth = 1.8 // Ширина узла
      treeModel.nodeHeight = 1 // Высота узла
      treeModel.nodeRadius = 3 // Радиус узла
      treeModel.horizontalSeparationBetweenNodes = -0.5 // Горизонтальная дистанция между узлами
      treeModel.verticalSeparationBetweenNodes = 0 // Вертикальная дистанция между узлами

      this.customTreeService()
    })
  }

  customTreeService() {
    // 1) оригинал createChart @url https://github.com/jgpATs2w/angular-d3-tree/blob/374aa9948f39138f7341d72777e8954d5b5e9194/projects/angular-d3-tree-lib/src/lib/angular-d3-tree-lib.service.ts#L12
    // 2) оригинал createTreeData (внутри createChart) @url https://github.com/jgpATs2w/angular-d3-tree/blob/374aa9948f39138f7341d72777e8954d5b5e9194/projects/angular-d3-tree-lib/src/lib/tree.dendo.model.ts#L70
    this.treeService.treeModel.createTreeData = () => {
      this.treeService.treeModel.root = d3
        .stratify<any>()
        .id(function (d) {
          return d.id
        })
        .parentId(function (d) {
          return d.parent
        })(this.chartData)
      this.treeService.treeModel.root.x0 = this.treeService.treeModel.height / 2
      this.treeService.treeModel.root.y0 = 0
    }

    this.treeService.createChart('#chartContainer', this.chartData)
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
