import { Component, Input } from '@angular/core';
import { MaterialsPopoverComponent } from '../materials-popover/materials-popover.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogData } from '../../../../models/DialogData';

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

  @Input()
  nodeFilePath: string;

  constructor(public dialog: MatDialog) { }

  openPDF(): void {
    const dialogRef = this.dialog.open(MaterialsPopoverComponent, {
      width: '800px',
      data: { title: 'Title', animal: 'a' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  };

  openAdaptivityPopup(): void {
    
    const dialogRef = this.dialog.open(MaterialsPopoverComponent, {
      width: '800px',
      data: this.prepareDialogData()
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  };

  prepareDialogData(): DialogData {
    const path = '/api/Upload?fileName=' + this.nodeFilePath;
    return {
      name: 'name',
      url: path,
      isAdaptive: true,
      needToGetInitialTest: false,
      needToChooseAdaptivityType: true
    }
  }
}
