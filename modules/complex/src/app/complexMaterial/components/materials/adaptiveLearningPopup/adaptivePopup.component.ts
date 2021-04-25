import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { DialogData } from '../../../../models/DialogData';
import { MaterialsPopoverComponent } from '../materials-popover/materials-popover.component';
import { AdaptivityService } from '../../../../service/adaptivity.service';

/**
 * @title Basic use of `<table mat-table>`
 */
@Component({
  selector: 'adaptive-popover',
  styleUrls: ['adaptivePopup.component.less'],
  templateUrl: 'adaptivePopup.component.html',
})
export class AdaptivePopupComponent {
  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AdaptivePopupComponent>,
    private adaptivityService: AdaptivityService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

   onNoClick(): void {
    this.dialogRef.close();
  }

  openAdaptivityPopup(adaptivityType: number): void {

    this.adaptivityService
      .getFirstThema(adaptivityType)
      .subscribe(themaRes => {
        const path = '/api/Upload?fileName=' + (themaRes.nextMaterialPaths && themaRes.nextMaterialPaths[0]);
        const diaogData: DialogData =
        {
          name: `${themaRes.nextThemaId}`,
          url: path,
          adaptivityType: adaptivityType,
          isAdaptive: true,
          adaptivity: themaRes
        };

        this.dialogRef.close();

        const dialogRefNew = this.dialog.open(MaterialsPopoverComponent, {
          width: '1200px',
          data: diaogData
        });

        dialogRefNew.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
        });

      });
  };
}
