import { Component, Input } from '@angular/core';
import { MaterialsPopoverComponent } from '../materials-popover/materials-popover.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogData } from '../../../../models/DialogData';
import { AdaptivityService } from '../../../../service/adaptivity.service';

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

  constructor(public dialog: MatDialog,
    private adaptivityService: AdaptivityService, ) { }

  openPDF(): void {
    const dialogRef = this.dialog.open(MaterialsPopoverComponent, {
      width: '800px',
      data: { title: 'Title', animal: 'a' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  };

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

        const dialogRef = this.dialog.open(MaterialsPopoverComponent, {
          width: '1200px',
          data: diaogData
        });

        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
        });

      });    
  };


}
