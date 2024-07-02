import { Component, Inject, OnInit, Input } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { Store } from '@ngrx/store'
import { DialogData } from '../../../../models/DialogData'
import { ComplexService } from '../../../../service/complex.service'
import { ComplexCascade } from '../../../../models/ComplexCascade'
import { BaseFileManagementComponent } from './base-file-management.component'
import { IAppState } from '../../../../store/states/app.state'
import { TranslatePipe } from 'educats-translate'
import { CatsService } from 'src/app/service/cats.service'
import { Help } from '../../../../models/help.model';

@Component({
  selector: 'add-app-materials-popover',
  templateUrl: './add-material-popover.component.html',
  styleUrls: ['./add-material-popover.component.less'],
})
export class AddMaterialPopoverComponent extends BaseFileManagementComponent<AddMaterialPopoverComponent> {
  navItems: ComplexCascade[] = []
  isFile: boolean
  isFolder: boolean
  editMode: boolean
  conceptId: any
  popupTitle: string
  public selectedConcept: string

  addComponentHelp: Help = {
    message: '',
    action: '',
  }

  constructor(
    public dialogRef: MatDialogRef<AddMaterialPopoverComponent>,
    private complexService: ComplexService,
    public store: Store<IAppState>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public translatePipe: TranslatePipe,
    public catsService: CatsService

  ) {
    super(dialogRef, store, data, translatePipe, catsService)
    this.isFile = false
    this.isFolder = false
    this.addComponentHelp = {
      message: this.translatePipe.transform(
        'text.help.addComponent',
        // tslint:disable-next-line:max-line-length
        'Чтобы добавить элемент электронного учебно-методического комплекса, необходимо выбрать для него раздел и тему. Далее отметьте тип элемента: Папка может иметь вложения, а Файл нет. Введите название элемента (темы ЭУМК). Для типа элемента Файл прикрепите файл в формате .pdf.'
      ),
      action: this.translatePipe.transform('button.understand', 'Понятно'),
    }
  }

  switchFormTo(formState: number) {
    this.isFile = formState === 2
    this.data.isGroup = this.isFolder = formState === 1
  }

  ngOnInit() {
    super.ngOnInit()
    const currentComplexID = localStorage.getItem('selectedComplex')
    this.complexService
      .getConceptCascadeFoldersOnly(currentComplexID)
      .subscribe((res) => {
        this.navItems = res
        if (this.data) {
          this.switchFormTo(this.data.isGroup ? 1 : 2)

          if (this.data.parentId) {
            this.selectConcept(this.data.parentId)
          }
        }
        this.editMode = this.data.id !== null && this.data.id !== '0'
        this.popupTitle = this.editMode
          ? this.translatePipe.transform(
              'complex.editComplexes',
              'Редактирование элемента ЭУМК'
            )
          : this.translatePipe.transform(
              'complex.addComplexesComponent',
              'Добавить элемент ЭУМК'
            );
        if (this.editMode) {
        this.addComponentHelp = {
          message: this.translatePipe.transform(
            'text.help.editComponent',
            'To edit an element of an Educational Complex, you need to select a section and topic for it. Next, mark the element type: Folder can have attachments, but File cannot. Enter the name of the element (Educational Complex topic). For the File element type, attach a .pdf file.'
          ),
          action: this.translatePipe.transform('button.understand', 'Понятно'),
        };
      } else {
        this.addComponentHelp = {
          message: this.translatePipe.transform(
            'text.help.addComponent',
            'To add an element of an Educational Complex, you need to select a section and topic for it. Next, mark the element type: Folder can have attachments, but File cannot. Enter the name of the element (Educational Complex topic). For the File element type, attach a .pdf file.'
          ),
          action: this.translatePipe.transform('button.understand', 'Понятно'),
        };
      }
      })
  }

  selectConcept(id: any) {
    this.data.parentId = this.conceptId = id
    this.selectedConcept = this.getConceptNameById(this.navItems, id)
  }

  getConceptNameById(cascades: ComplexCascade[], id: any) {
    for (const concept of cascades) {
      if (concept.Id == id) {
        return concept.Name
      }

      if (concept.children && concept.children.length > 0) {
        const resultOrderItem = this.getConceptNameById(concept.children, id)

        if (resultOrderItem) {
          return concept.Name + ' > ' +  resultOrderItem
        }
      }
    }
    return null
  }
}
