import { Observable } from 'rxjs'
import { Component, Inject, OnDestroy, OnInit } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { SubSink } from 'subsink'

import { DialogData } from '../../../models/dialog-data.model'
import { SubjectService } from '../../../services/subject.service'
import { SubjectForm } from 'src/app/models/form/subject-form.model'
import { TranslatePipe } from 'educats-translate'
import { Module, ModuleType } from 'src/app/models/modue.model'

interface Group {
  id: number
  value: string
}

@Component({
  selector: 'app-subject-management',
  templateUrl: './subject-management.component.html',
  styleUrls: ['./subject-management.component.less'],
})
export class SubjectManagementComponent implements OnInit, OnDestroy {
  private subs = new SubSink()
  isLoading = false
  subject: SubjectForm
  columnsCount = 2

  groupList: Group[] = []
  selectedGroups: number[] = []

  constructor(
    public dialogRef: MatDialogRef<SubjectManagementComponent>,
    public subjectService: SubjectService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public translate: TranslatePipe
  ) {
    this.dialogRef.disableClose = true
  }

  onCancel(): void {
    this.dialogRef.close()
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe()
  }

  ngOnInit(): void {
    let manSubject$: Observable<SubjectForm>
    if (this.data.model && this.data.model.subjectId) {
      manSubject$ = this.subjectService.editSubject(this.data.model.subjectId)
    } else {
      manSubject$ = this.subjectService.getCreateModel()
    }

    this.subs.add(
      manSubject$.subscribe((res) => {
        this.subject = res
        this.setGroupList()
      })
    )
  }

  save(): void {
    this.subject.SelectedGroups = [...this.selectedGroups]
    this.dialogRef.close(this.subject)
  }

  private setGroupList(): void {
    this.groupList = this.subject.Groups.map((g) => ({
      id: +g.Value,
      value: g.Text,
    }))
    this.selectedGroups = this.subject.SelectedGroups
      ? [...this.subject.SelectedGroups]
      : []
  }

  getSelectedValue(id) {
    return this.groupList.find((group) => group.id === id).value
  }

  getModuleName(module: Module) {
    return this.translate.transform(
      this.getModuleTranslationString(module.Type),
      module.Name
    )
  }

  private getModuleTranslationString(moduleType: ModuleType) {
    switch (moduleType) {
      case ModuleType.News:
        return 'text.news.plural'
      case ModuleType.Lectures:
        return 'text.lectures.plural'
      case ModuleType.Practical:
        return 'text.menu.workshops'
      case ModuleType.Labs:
        return 'text.subjects.labs.plural'
      case ModuleType.YeManagment:
        return 'text.menu.course'
      case ModuleType.SmartTest:
        return 'text.menu.tests'
      case ModuleType.InteractiveTutorial:
        return 'text.menu.interactive.book'
      case ModuleType.SubjectAttachments:
        return 'text.attachments.plural'
      case ModuleType.ComplexMaterial:
        return 'text.menu.cm'
    }
  }
}
