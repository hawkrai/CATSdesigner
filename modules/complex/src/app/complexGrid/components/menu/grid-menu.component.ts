import { Component, Input } from '@angular/core';
import { ComplexGridEditPopupComponent } from '../edit-popup/edit-popup.component';
import { MapPopoverComponent } from '../map-popover/map-popover.component';
import { ComponentType } from '@angular/cdk/typings/portal';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogData } from '../../../models/DialogData'

/**
 * @title Menu with icons
 */
@Component({
  selector: 'grid-menu-icon',
  templateUrl: 'grid-menu.component.html',
  styleUrls: ['grid-menu.component.less'],
})
export class GridMenuComponent {
  @Input()
  subjId: string;

  constructor(public dialog: MatDialog) { }  

  openEditPopup(): void {

    const dialogData: DialogData = {
      buttonText: 'Сохранить',
      width: '400px',
      title: 'Редактирование'
    };

    const dialogRef = this.openDialog(dialogData, ComplexGridEditPopupComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });

  }

  openMap(): void {
    const dialogData: DialogData = {
      id: this.subjId
    };

    const dialogRef = this.dialog.open(MapPopoverComponent, {
      width: '800px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');      
    });
  }

  openDialog(data: DialogData, popover: ComponentType<any>): MatDialogRef<any> {
    return this.dialog.open(popover, { data });
  }
}
