import { Component } from '@angular/core';
import { MaterialsPopoverComponent } from '../materials-popover/materials-popover.component';
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
}
