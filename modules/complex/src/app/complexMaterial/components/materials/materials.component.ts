import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, Input, OnInit } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MaterialsPopoverComponent } from './materials-popover/materials-popover.component';
import { MonitoringPopoverComponent } from './monitoring-popover/monitoring-popover.component';
import { ComplexCascade } from '../../../models/ComplexCascade';
import { ComplexService } from '../../../service/complex.service';


@Component({
  selector: 'app-material-tree',
  templateUrl: './materials.component.html',
  styleUrls: ['./materials.component.less'],
})
export class MaterialComponent implements OnInit {
  @Input() complexId: string;
  isLucturer: boolean;
  treeControl = new NestedTreeControl<ComplexCascade>(node => node.children);
  dataSource = new MatTreeNestedDataSource<ComplexCascade>();

  constructor(public dialog: MatDialog,
    private complexService: ComplexService) {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    this.isLucturer = user.role === 'lector';
  }

  hasChild = (_: number, node: ComplexCascade) => !!node.children && node.children.length > 0;

  ngOnInit() {
    this.complexService.getConceptCascade(this.complexId).subscribe(res => {
      this.dataSource.data = res.children;
      this.treeControl.dataNodes = res.children;
      this.treeControl.expandAll();
    });  
  }
  
  openPDF(filename: string): void {
    const path = '/api/Upload?fileName=' + filename;
    const dialogRef = this.dialog.open(MaterialsPopoverComponent, {
      width: '1200px',
      data: { name: 'name', url: path }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  };

  openMonitoring(nodeId: string, nodeName: string): void {
    const dialogRef = this.dialog.open(MonitoringPopoverComponent, {
      width: '800px',
      data: { title: 'Title', nodeId: nodeId, name: nodeName }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
