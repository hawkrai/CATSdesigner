import { Component, Input } from '@angular/core';
import { MaterialsPopoverComponent } from '../materials-popover/materials-popover.component';
import { MonitoringPopoverComponent } from '../monitoring-popover/monitoring-popover.component';
import { MatDialog } from '@angular/material/dialog';

/**
 * @title Menu with icons
 */
@Component({
  selector: 'menu-icon',
  templateUrl: 'menu.component.html',
  styleUrls: ['menu.component.less'],
})
export class MenuComponent {
  @Input()
  nodeId: string;

  constructor(public dialog: MatDialog) { }

  openPDF(): void {
    const dialogRef = this.dialog.open(MaterialsPopoverComponent, {
      width: '800px',
      data: { title: 'Title', animal: 'a' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  openMonitoring(): void {
    const dialogRef = this.dialog.open(MonitoringPopoverComponent, {
      width: '800px',
      data: { title: 'Title', nodeId: this.nodeId}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
