import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/typings/portal';
import { ComplexGridEditPopupComponent } from './components/edit-popup/edit-popup.component';
import { ComplexRulesPopoverComponent } from './components/complex-rules-popover/complex-rules-popover.component';
import { ComplexService } from '../service/complex.service';
import { DialogData } from '../models/DialogData';
import { Complex } from '../models/Complex';


@Component({
  selector: 'complex-grid',
  templateUrl: './complexGrid.component.html',
  styleUrls: ['./complexGrid.component.less']
})
export class ComplexGridComponent implements OnInit {

  complexes;
  subjectName;

  constructor(public dialog: MatDialog,
        private complexService: ComplexService,
        private router: Router) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    this.router.onSameUrlNavigation = 'reload';
  }

  ngOnInit(): void {
    this.complexService.getRootConcepts('3').subscribe(res => {
      this.complexes = res;
    });
    this.complexService.getRootConceptsSubjectName('3').subscribe(res => {
      this.subjectName = res;
    });
  }
  onAddButtonClick() {

    const dialogData: DialogData = {
      buttonText: 'Сохранить',
      width: '400px',
      title: 'Создание ЭУМК',
      name: '',
      subjectName: this.subjectName,
      isNew: true
    };

    const dialogRef = this.openDialog(dialogData, ComplexGridEditPopupComponent);

    dialogRef.afterClosed().subscribe(result => {
      const complex: Complex = {
        name: result.name,
        container: '',
        subjectId: 3
      }
      this.complexService.addRootConcept(complex).subscribe(result => {
        debugger;
        if (result['Code'] === '200') {
          this.router.navigateByUrl('/main');
        }
      });      
    });
  }

  openDialog(data: DialogData, popover: ComponentType<any>): MatDialogRef<any> {
    return this.dialog.open(popover, { data });
  }

  openPDF() {
    const dialogRef = this.dialog.open(ComplexRulesPopoverComponent, {
      width: '800px',
      data: { name: 'name'}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
