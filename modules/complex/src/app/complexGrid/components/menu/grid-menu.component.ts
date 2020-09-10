import { Component, Input } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ComplexGridEditPopupComponent } from '../edit-popup/edit-popup.component';
import { MapPopoverComponent } from '../map-popover/map-popover.component';
import { ComponentType } from '@angular/cdk/typings/portal';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogData } from '../../../models/DialogData';
import { ComplexService } from '../../../service/complex.service';

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
  complexId: string;

  constructor(public dialog: MatDialog, private complexService: ComplexService, private router: Router) { }  

  openEditPopup(): void {

    this.complexService.getConceptCascade(this.complexId).subscribe(res => {
      const dialogData: DialogData = {
        buttonText: 'Сохранить',
        width: '400px',
        title: 'Редактирование',
        isNew: false,
        name: res.Name,
        subjectName: res.SubjectName,
        isPublished: res.IsPublished
      };

      const dialogRef = this.openDialog(dialogData, ComplexGridEditPopupComponent);

      dialogRef.afterClosed().subscribe(result => {
        this.router.navigate(['/main']);
      }); 
    });
  }

  openMap(): void {
    const dialogData: DialogData = {
      id: this.complexId
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
