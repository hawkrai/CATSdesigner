import { Component, Inject, OnInit, Input } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { Store } from '@ngrx/store'
import { DialogData } from '../../../../models/DialogData'
import { ComplexService } from '../../../../service/complex.service'
import { ComplexCascade } from '../../../../models/ComplexCascade'
import { BaseFileManagementComponent } from './base-file-management.component'
import { IAppState } from '../../../../store/states/app.state'
import { TranslatePipe } from 'educats-translate'
import { CatsService, CodeType } from 'src/app/service/cats.service'
import { Help } from '../../../../models/help.model'
import { MaterialFormType } from '../../../../models/material-form-type.enum'
import { take } from 'rxjs/operators'
import * as filesActions from '../../../../store/actions/files.actions'

@Component({
  selector: 'add-app-materials-popover',
  templateUrl: './add-material-popover.component.html',
  styleUrls: ['./add-material-popover.component.less'],
})
export class AddMaterialPopoverComponent extends BaseFileManagementComponent<AddMaterialPopoverComponent> {
  MaterialFormType = MaterialFormType
  navItems: ComplexCascade[] = []
  isFile: boolean
  isFolder: boolean
  editMode: boolean
  addMode: boolean
  conceptId: any
  popupTitle: string
  public selectedConcept: string
  private initialName: string = ''
  private initialParentId: any = null
  private initialFiles: any[] = []
  private initialIsGroup: boolean = false

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
    this.editMode = false
    this.addMode = false
    this.selectedConcept = ''
    this.addComponentHelp = {
      message: this.translatePipe.transform(
        'text.help.addComponent',
        'Чтобы добавить элемент электронного учебно-методического комплекса, необходимо выбрать для него раздел и тему. Далее отметьте тип элемента: Папка может иметь вложения, а Файл нет. Введите название элемента (темы ЭУМК). Для типа элемента Файл прикрепите файл в формате .pdf.'
      ),
      action: this.translatePipe.transform('common.clear', 'Понятно'),
    }
  }

  switchFormTo(formState: MaterialFormType) {
    this.isFile = formState === MaterialFormType.File
    this.data.isGroup = this.isFolder = formState === MaterialFormType.Folder
  }

  ngOnInit() {
    super.ngOnInit()
    const currentComplexID = localStorage.getItem('selectedComplex')
    this.complexService
      .getConceptCascadeFoldersOnly(currentComplexID)
      .subscribe((res) => {
        this.navItems = this.translateNavItems(res)
        if (this.data) {
          if (this.addMode && this.data.isGroup === undefined) {
            this.switchFormTo(MaterialFormType.File)
          } else {
            this.switchFormTo(this.data.isGroup ? MaterialFormType.Folder : MaterialFormType.File)
          }

          if (!this.data.parentId && currentComplexID && this.addMode) {
            this.data.parentId = parseInt(currentComplexID, 10)
            this.selectConcept(this.data.parentId)
          } else if (this.data.parentId) {
            this.selectConcept(this.data.parentId)
          }
        }
        if (this.data.id !== null && this.data.id !== '0') {
          this.editMode = true;
          this.addMode = false;
        }
        else {
          this.addMode = true;
          this.editMode = false;
        }
        this.popupTitle = this.editMode
          ? this.translatePipe.transform(
              'complex.editComponent',
              'Редактирование элемента ЭУМК'
            )
          : this.translatePipe.transform(
              'complex.addComplexesComponent',
              'Добавить элемент ЭУМК'
            )
        if (this.editMode) {
          this.initialName = this.data.name || ''
          this.initialParentId = this.data.parentId || null
          this.initialIsGroup = this.data.isGroup || false
          if (this.data.attachments) {
            this.initialFiles = JSON.parse(JSON.stringify(this.data.attachments))
          }
          this.addComponentHelp = {
            message: this.translatePipe.transform(
              'text.help.editComponent',
              'To edit an element of an Educational Complex, you need to select a section and topic for it. Next, mark the element type: Folder can have attachments, but File cannot. Enter the name of the element (Educational Complex topic). For the File element type, attach a .pdf file.'
            ),
            action: this.translatePipe.transform(
              'common.clear',
              'Понятно'
            ),
          }
        } else {
          this.addComponentHelp = {
            message: this.translatePipe.transform(
              'text.help.addComponent',
              'To add an element of an Educational Complex, you need to select a section and topic for it. Next, mark the element type: Folder can have attachments, but File cannot. Enter the name of the element (Educational Complex topic). For the File element type, attach a .pdf file.'
            ),
            action: this.translatePipe.transform(
              'common.clear',
              'Понятно'
            ),
          }
        }
      })
  }

  translateNavItems(items: ComplexCascade[]) {
    const translationKeys = {
      'Теоретический раздел': 'complex.section.theoretical',
      'Практический раздел': 'complex.section.practical',
      'Блок контроля знаний': 'complex.section.control',
    }

    return items.map((item) => ({
      ...item,
      Name: translationKeys[item.Name]
        ? this.translatePipe.transform(translationKeys[item.Name], item.Name)
        : item.Name,
      children: item.children ? this.translateNavItems(item.children) : [],
    }))
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
          return concept.Name + ' > ' + resultOrderItem
        }
      }
    }
    return null
  }

  get isMandatoryEUMKComponent(): boolean {
    return this.data.isMandatoryComponent === true
  }

  get shouldDisableConceptSelector(): boolean {
    if (this.isMandatoryEUMKComponent) {
      return true
    }

    if (this.editMode && this.data.testId) {
      return true
    }
    return false
  }

  get isTestOrKnowledgeControlBlock(): boolean {
    if (this.data.testId) {
      return true
    }
    const nameToCheck = this.data.name || ''
    const knowledgeControlBlockOriginal = 'Блок контроля знаний'
    const knowledgeControlBlockTranslated = this.translatePipe.transform(
      'complex.section.control',
      'Блок контроля знаний'
    )
    return (
      nameToCheck.includes(knowledgeControlBlockOriginal) ||
      nameToCheck.includes(knowledgeControlBlockTranslated) ||
      knowledgeControlBlockTranslated.includes(nameToCheck)
    )
  }

  get isSelectedConceptKnowledgeControlBlock(): boolean {
    if (!this.selectedConcept && (!this.conceptId || this.conceptId === null || this.conceptId === undefined)) {
      return false
    }
    
    const knowledgeControlBlockOriginal = 'Блок контроля знаний'
    const knowledgeControlBlockTranslated = this.translatePipe.transform(
      'complex.section.control',
      'Блок контроля знаний'
    )
    
    if (this.selectedConcept && this.selectedConcept.trim() !== '') {
      const selectedConceptName = this.selectedConcept
      if (
        selectedConceptName.includes(knowledgeControlBlockOriginal) ||
        selectedConceptName.includes(knowledgeControlBlockTranslated)
      ) {
        return true
      }
    }
    
    if (this.conceptId && this.navItems && this.navItems.length > 0) {
      const conceptPath = this.getConceptPath(this.navItems, this.conceptId)
      if (conceptPath) {
        return (
          conceptPath.includes(knowledgeControlBlockOriginal) ||
          conceptPath.includes(knowledgeControlBlockTranslated)
        )
      }
    }
    
    return false
  }

  findConceptById(cascades: ComplexCascade[], id: any): ComplexCascade | null {
    for (const concept of cascades) {
      if (concept.Id == id) {
        return concept
      }
      if (concept.children && concept.children.length > 0) {
        const found = this.findConceptById(concept.children, id)
        if (found) {
          return found
        }
      }
    }
    return null
  }

  getConceptPath(cascades: ComplexCascade[], id: any): string | null {
    for (const concept of cascades) {
      if (concept.Id == id) {
        return concept.Name
      }
      if (concept.children && concept.children.length > 0) {
        const childPath = this.getConceptPath(concept.children, id)
        if (childPath) {
          return concept.Name + ' > ' + childPath
        }
      }
    }
    return null
  }

  get shouldHideFileUpload(): boolean {
    if (this.data && (this.data.isGroup || this.data.testId)) {
      return true
    }
    
    if (!this.editMode) {
      return this.isSelectedConceptKnowledgeControlBlock
    } else {
      if (this.isSelectedConceptKnowledgeControlBlock) {
        return true
      }
      
      const nameToCheck = (this.data && this.data.name) || ''
      if (!nameToCheck) {
        return false
      }
      
      const knowledgeControlBlockOriginal = 'Блок контроля знаний'
      const knowledgeControlBlockTranslated = this.translatePipe.transform(
        'complex.section.control',
        'Блок контроля знаний'
      )
      if (
        nameToCheck.includes(knowledgeControlBlockOriginal) ||
        nameToCheck.includes(knowledgeControlBlockTranslated) ||
        knowledgeControlBlockTranslated.includes(nameToCheck)
      ) {
        return true
      }
    }
    
    return false
  }

  hasChanges(): boolean {
    const currentName = this.data.name || ''
    if (currentName !== this.initialName) {
      return true
    }

    const currentParentId = this.data.parentId || null
    if (currentParentId !== this.initialParentId) {
      return true
    }

    const currentIsGroup = this.data.isGroup || false
    if (currentIsGroup !== this.initialIsGroup) {
      return true
    }

    return false
  }

  hasFileChanges(files: any[]): boolean {
    if (!files) {
      return false
    }

    if (files.length !== this.initialFiles.length) {
      return true
    }

    if (files.length === 0 && this.initialFiles.length === 0) {
      return false
    }

    const currentFileIds = files
      .map(f => f.IdFile || (f.id && f.id > 0 ? f.id : null))
      .filter(id => id !== null)
      .sort()
    const initialFileIds = this.initialFiles
      .map(f => (f.id && f.id > 0 ? f.id : null))
      .filter(id => id !== null)
      .sort()
    
    if (JSON.stringify(currentFileIds) !== JSON.stringify(initialFileIds)) {
      return true
    }

    const hasNewFiles = files.some(f => !f.IdFile || f.IdFile <= 0)
    if (hasNewFiles) {
      return true
    }

    return false
  }

  isFormValid(files: any[]): boolean {
    if (!this.data.name || this.data.name.trim() === '') {
      return false
    }

    if (this.addMode && (!this.data.parentId || this.data.parentId === null)) {
      return false
    }
    

    if (this.editMode && !this.hasChanges() && !this.hasFileChanges(files)) {
      return false
    }

    return true
  }

  uploadFile(file: File) {
    this.files$.pipe(take(1)).subscribe(files => {
      if (files.length >= 15) {
        this.catsService.showMessage({
          Message: this.translatePipe.transform(
            'complex.maxFilesReached',
            'Достигнут максимальный лимит файлов (15)'
          ),
          Type: CodeType.error,
        })
        return
      }
      this.store.dispatch(filesActions.uploadFile({ file }))
    })
  }
}
