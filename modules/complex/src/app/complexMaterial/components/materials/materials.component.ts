import { NestedTreeControl } from '@angular/cdk/tree';
import { Component } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/typings/portal';
import { MaterialsPopoverComponent } from './materials-popover/materials-popover.component';
import { MenuComponent } from './menu/menu.component';
import { ComplexCascade } from '../../../models/ComplexCascade';
import { ComplexService } from '../../../service/complex.service';


@Component({
  selector: 'app-material-tree',
  templateUrl: './materials.component.html',
  styleUrls: ['./materials.component.less'],
})
export class MaterialComponent {
  treeControl = new NestedTreeControl<ComplexCascade>(node => node.Children);
  dataSource = new MatTreeNestedDataSource<ComplexCascade>();

  constructor(public dialog: MatDialog,
    private complexService: ComplexService) {
    this.complexService.getConceptCascade('3').subscribe(res => {
      this.dataSource.data = res.Children;
    });
     
  }

  hasChild = (_: number, node: ComplexCascade) => !!node.Children && node.Children.length > 0;

  
  openPDF(): void {
    const dialogRef = this.dialog.open(MaterialsPopoverComponent, {
      width: '800px',
      data: { name: 'name', animal: 'a' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');      
    });
  }
}
