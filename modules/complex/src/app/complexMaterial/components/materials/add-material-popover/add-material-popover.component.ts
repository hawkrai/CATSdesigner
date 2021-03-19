import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { DialogData } from '../../../../models/DialogData';
import { ComplexService } from '../../../../service/complex.service';
import { ComplexCascade } from '../../../../models/ComplexCascade';
import { BaseFileManagementComponent } from './base-file-management.component';
import { IAppState } from '../../../../store/states/app.state';

@Component({
  selector: 'add-app-materials-popover',
  templateUrl: './add-material-popover.component.html',
  styleUrls: ['./add-material-popover.component.less']
})
export class AddMaterialPopoverComponent extends BaseFileManagementComponent<AddMaterialPopoverComponent>{
  navItems: ComplexCascade[] = [];
  isFile: boolean;
  isFolder: boolean;
  editMode: boolean;
  conceptId: any;
  popupTitle: string;
  public selectedConcept: string;

  constructor(
    public dialogRef: MatDialogRef<AddMaterialPopoverComponent>,
    private complexService: ComplexService,
    public store: Store<IAppState>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    super(dialogRef, store, data);
    this.isFile = false;
    this.isFolder = false;
  }


  switchFormTo(formState: number) {
    this.isFile = formState === 2;
    this.data.isGroup = this.isFolder = formState === 1;    
  }

  ngOnInit() {
    super.ngOnInit();
    const currentComplexID = localStorage.getItem('selectedComplex');
    this.complexService.getConceptCascadeFoldersOnly(currentComplexID).subscribe(res => {
      this.navItems = res;
      if (this.data) {
        this.switchFormTo(this.data.isGroup ? 1 : 2);

        if (this.data.parentId) {
          this.selectConcept(this.data.parentId);
        }
      }
      this.editMode = this.data.id !== null && this.data.id !== '0';
      this.popupTitle = this.editMode ? 'Редактировать ЭУМК' : 'Добавить элемент ЭУМК'
    });    
  }

  selectConcept(id: any) {
    this.data.parentId = this.conceptId = id;     
    this.selectedConcept = this.getConceptNameById(this.navItems, id);
  }

  getConceptNameById(cascades: ComplexCascade[], id: any) {
    for (var concept of cascades) {
      if (concept.Id == id) {
        return concept.Name;
      }

      if (concept.children && concept.children.length > 0) {
        const resultOrderItem = this.getConceptNameById(concept.children, id);

        if (resultOrderItem) {
          return resultOrderItem;
        }
      }
    }
    return null;
  }
}
