import { DialogService } from './../../../../services/dialog.service'
import { MatTable } from '@angular/material'
import { Store } from '@ngrx/store'
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop'
import { SubSink } from 'subsink'
import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  AfterViewChecked,
  ViewChild,
} from '@angular/core'
import { filter } from 'rxjs/operators'

import { Lab } from '../../../../models/lab.model'
import { IAppState } from '../../../../store/state/app.state'
import { DialogData } from '../../../../models/dialog-data.model'
import { LabWorkPopoverComponent } from './lab-work-popover/lab-work-popover.component'
import { DeletePopoverComponent } from '../../../../shared/delete-popover/delete-popover.component'
import { Attachment } from '../../../../models/file/attachment.model'
import { FileDownloadPopoverComponent } from '../../../../shared/file-download-popover/file-download-popover.component'
import * as labsActions from '../../../../store/actions/labs.actions'
import { CreateLessonEntity } from './../../../../models/form/create-lesson-entity.model'
import * as labsSelectors from '../../../../store/selectors/labs.selectors'
import * as filesActions from '../../../../store/actions/files.actions'
import * as subjectSelectors from '../../../../store/selectors/subject.selector'
import { TranslatePipe } from 'educats-translate'

@Component({
  selector: 'app-labs-work',
  templateUrl: './labs-work.component.html',
  styleUrls: ['./labs-work.component.less'],
})
export class LabsWorkComponent implements OnInit, OnDestroy, AfterViewChecked {
  isTeacher: boolean
  @ViewChild('table', { static: false }) table: MatTable<Lab>
  private subs = new SubSink()
  public labs: Lab[]
  labPrefix: string

  constructor(
    private store: Store<IAppState>,
    private dialogService: DialogService,
    private cdRef: ChangeDetectorRef,
    private translate: TranslatePipe
  ) {}

  ngOnInit() {
    if (localStorage.getItem('locale') === 'en') {
      this.labPrefix = 'Lab'
    } else {
      this.labPrefix = 'Лаб'
    }
    this.store.dispatch(labsActions.loadLabs())
    this.subs.add(
      this.store.select(labsSelectors.getLabs).subscribe((labs) => {
        this.labs = [...labs]
      }),
      this.store.select(subjectSelectors.isTeacher).subscribe((isTeacher) => {
        this.isTeacher = isTeacher
      })
    )
  }

  getDisplayedColumns(): string[] {
    const defaultColumns = [
      'position',
      'theme',
      'shortName',
      'duration',
      'files',
    ]
    if (this.isTeacher) {
      return defaultColumns.concat('actions')
    }
    return defaultColumns
  }

  ngAfterViewChecked(): void {
    this.cdRef.detectChanges()
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe()
    this.store.dispatch(labsActions.resetLabs())
  }

  constructorLab(labsCount: number, lab: Lab): void {
    const newLab = this.getLab(labsCount, lab)
    const dialogData: DialogData = {
      title: lab
        ? this.translate.transform(
            'text.subjects.labs.editing',
            'Редактирование лабораторной работы'
          )
        : this.translate.transform(
            'text.subjects.labs.adding',
            'Добавление лабораторной работы'
          ),
      buttonText: this.translate.transform('button.save', 'Сохранить'),
      model: newLab,
    }
    const dialogRef = this.dialogService.openDialog(
      LabWorkPopoverComponent,
      dialogData
    )

    this.subs.add(
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          result.attachments = JSON.stringify(result.attachments)
          this.store.dispatch(
            labsActions.saveLab({ lab: result as CreateLessonEntity })
          )
        }
      })
    )
  }

  deleteLab(lab: Lab) {
    const dialogData: DialogData = {
      title: this.translate.transform(
        'text.subjects.labs.deleting',
        'Удаление лабораторной работы'
      ),
      body: `${this.translate
        .transform('text.subjects.labs.dative', 'лабораторную работу')
        .toLowerCase()} "${lab.Theme}"`,
      buttonText: this.translate.transform('button.delete', 'Удалить'),
    }
    const dialogRef = this.dialogService.openDialog(
      DeletePopoverComponent,
      dialogData
    )

    this.subs.add(
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.store.dispatch(labsActions.deleteLab({ id: lab.LabId }))
        }
      })
    )
  }

  openFilePopup(attachments: Attachment[]) {
    const dialogData: DialogData = {
      title: this.translate.transform('text.attachments.plural', 'Файлы'),
      buttonText: this.translate.transform('text.download', 'Скачать'),
      body: attachments,
    }
    const dialogRef = this.dialogService.openDialog(
      FileDownloadPopoverComponent,
      dialogData
    )

    this.subs.add(
      dialogRef
        .afterClosed()
        .pipe(filter((r) => !!r))
        .subscribe((result: Attachment[]) => {
          if (result.length) {
            if (result.length === 1) {
              const attachment = result[0]
              this.store.dispatch(
                filesActions.downloadFile({
                  fileName: attachment.FileName,
                  pathName: attachment.PathName,
                })
              )
            } else {
              this.store.dispatch(
                filesActions.getAttachmentsAsZip({
                  attachmentsIds: result.map((r) => r.Id),
                })
              )
            }
          }
        })
    )
  }

  drop(event: CdkDragDrop<Lab[]>): void {
    const prevIndex = event.container.data.findIndex(
      (i) => i.LabId == event.item.data.LabId
    )
    if (prevIndex !== event.currentIndex) {
      moveItemInArray(event.container.data, prevIndex, event.currentIndex)
      this.store.dispatch(
        labsActions.updateOrder({ prevIndex, currentIndex: event.currentIndex })
      )
      this.table.renderRows()
    }
  }

  private getLab(labsCount: number, lab: Lab) {
    const order = lab ? lab.Order : labsCount + 1
    return {
      id: lab ? lab.LabId : 0,
      theme: lab ? lab.Theme : '',
      duration: lab ? lab.Duration : 1,
      order,
      pathFile: lab ? lab.PathFile : '',
      attachments: lab ? lab.Attachments : [],
      shortName: `'Lab' | translate: 'Лаб'${order}`,
    }
  }
}
