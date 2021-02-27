import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { IAppState } from '../store/states/app.state';
import { getSubjectId } from '../store/selectors/subject.selector';
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
  subjectId;

  isLucturer: boolean;

  constructor(public dialog: MatDialog,
        private complexService: ComplexService,
        private store: Store<IAppState>,
        private router: Router) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    this.router.onSameUrlNavigation = 'reload';

    const user = JSON.parse(localStorage.getItem("currentUser"));
    this.isLucturer = user.role === 'lector';
  }

  ngOnInit(): void {
    this.store.pipe(select(getSubjectId)).subscribe(subjectId => {
      this.subjectId = subjectId;
      this.complexService.getRootConcepts(this.subjectId).subscribe(res => {
        this.complexes = res;
      });
      this.complexService.getRootConceptsSubjectName(this.subjectId).subscribe(res => {
        this.subjectName = res;
      });      
    })    
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
        subjectId: this.subjectId,
        includeLabs: result.includeLabs,
        includeLectures: result.includeLectures,
        includeTests: result.includeTests
      }
      this.complexService.addRootConcept(complex).subscribe(result => {
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

  adjustNameLength(componentName: string): string {
    if (componentName.length <= 9) {
      return componentName;
    }

    return `${componentName.substring(0, 8)}...`;
  }

}
