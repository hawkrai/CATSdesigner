import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/typings/portal';
import { ComplexGridEditPopupComponent } from './components/edit-popup/edit-popup.component';
import { ComplexRulesPopoverComponent } from './components/complex-rules-popover/complex-rules-popover.component';
import { ComplexService } from '../service/complex.service';
import { DialogData } from '../models/DialogData'
import { ComplexGrid } from '../models/ComplexGrid'


@Component({
  selector: 'complex-grid',
  templateUrl: './complexGrid.component.html',
  styleUrls: ['./complexGrid.component.less']
})
export class ComplexGridComponent implements OnInit {

  complexes;

  constructor(public dialog: MatDialog,
              private complexService: ComplexService) {
  }

  ngOnInit(): void {
    this.complexService.getRootConcepts('3').subscribe(res => {
      console.log(res);
      this.complexes = res;
    });    
  }
  onAddButtonClick() {

    const dialogData: DialogData = {
      buttonText: 'Сохранить',
      width: '400px',
      title: 'Создание',
      name: '',
      isNew: true
    };

    const dialogRef = this.openDialog(dialogData, ComplexGridEditPopupComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');      
    });
  }

  openDialog(data: DialogData, popover: ComponentType<any>): MatDialogRef<any> {
    return this.dialog.open(popover, { data });
  }

  openPDF() {
    const dialogRef = this.dialog.open(ComplexRulesPopoverComponent, {
      width: '800px',
      data: { name: 'name', animal: 'a' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
