import { Component, Input } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ComplexGridEditPopupComponent } from '../edit-popup/edit-popup.component';
import { MapPopoverComponent } from '../map-popover/map-popover.component';
import { ComponentType } from '@angular/cdk/typings/portal';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogData } from '../../../models/DialogData';
import { ComplexService } from '../../../service/complex.service';
import { Complex } from '../../../models/Complex';

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

  constructor(public dialog: MatDialog, private complexService: ComplexService, private router: Router) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    this.router.onSameUrlNavigation = 'reload';
  }  

  openEditPopup(): void {

    this.complexService.getConceptCascade(this.complexId).subscribe(res => {
      const dialogData: DialogData = {
        buttonText: 'Сохранить',
        width: '400px',
        title: 'Редактирование',
        isNew: false,
        name: res.Name,
        subjectName: res.SubjectName,
        isPublished: res.Published
      };

      const dialogRef = this.openDialog(dialogData, ComplexGridEditPopupComponent);

      dialogRef.afterClosed().subscribe(result => {
        console.log(result);
        if (!result.isNew) {
          const complex: Complex = {
            elementId: +this.complexId,
            name: result.name,
            isPublished: result.isPublished && result.isPublished === true
          }
          this.complexService.editRootConcept(complex).subscribe(result => {
            debugger;
            if (result['Code'] === '200') {
              this.router.navigateByUrl('/main');
            }
          });
        }
      }); 
    });
  }

  onDeleteClick(): void {
    const complex: Complex = {
      elementId: +this.complexId     
    }
    this.complexService.deleteConcept(complex).subscribe(result => {
      if (result['Code'] === '200') {
        this.router.navigateByUrl('/main');
      }
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
