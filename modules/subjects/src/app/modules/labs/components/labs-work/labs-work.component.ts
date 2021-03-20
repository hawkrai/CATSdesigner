import { ConvertedAttachment } from './../../../../models/file/converted-attachment.model';
import { DialogService } from './../../../../services/dialog.service';
import { Observable } from 'rxjs';
import { MatTable } from '@angular/material';
import {Store} from '@ngrx/store';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { SubSink } from 'subsink';
import { Component, Input, OnInit, OnDestroy, ChangeDetectorRef, AfterViewChecked, ViewChild } from '@angular/core';
import { filter } from 'rxjs/operators';

import {Lab} from "../../../../models/lab.model";
import {IAppState} from '../../../../store/state/app.state';
import {DialogData} from '../../../../models/dialog-data.model';
import {LabWorkPopoverComponent} from './lab-work-popover/lab-work-popover.component';
import {DeletePopoverComponent} from '../../../../shared/delete-popover/delete-popover.component';
import {Attachment} from '../../../../models/file/attachment.model';
import {FileDownloadPopoverComponent} from '../../../../shared/file-download-popover/file-download-popover.component';
import * as labsActions from '../../../../store/actions/labs.actions';
import { CreateLessonEntity } from './../../../../models/form/create-lesson-entity.model';
import * as labsSelectors from '../../../../store/selectors/labs.selectors';
import { attachmentConverter } from 'src/app/utils';
import * as filesActions from '../../../../store/actions/files.actions';

@Component({
  selector: 'app-labs-work',
  templateUrl: './labs-work.component.html',
  styleUrls: ['./labs-work.component.less']
})
export class LabsWorkComponent implements OnInit, OnDestroy, AfterViewChecked {

  @Input() isTeacher: boolean;
  @ViewChild('table', { static: false }) table: MatTable<Lab>;
  private subs = new SubSink();
  public labs$: Observable<Lab[]>;
  private prefix = 'ЛР';

  constructor(
    private store: Store<IAppState>,
    private dialogService: DialogService,
    private cdRef: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.store.dispatch(labsActions.loadLabs());
    this.labs$ = this.store.select(labsSelectors.getLabs);
  }

  getDisplayedColumns(): string[] {
    const defaultColumns = ['position', 'theme', 'shortName', 'clock'];
    return defaultColumns.concat(this.isTeacher ? 'actions' : 'files');
  }

  ngAfterViewChecked(): void {
    this.cdRef.detectChanges();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    this.store.dispatch(labsActions.resetLabs());
  }

  constructorLab(labsCount: number, lab: Lab): void {
    const newLab = this.getLab(labsCount, lab);
    const dialogData: DialogData = {
      title: lab ? 'Редактирование лабораторной работы' : 'Добавление лабораторной работы',
      buttonText: 'Сохранить',
      model: newLab
    };
    const dialogRef = this.dialogService.openDialog(LabWorkPopoverComponent, dialogData);

    this.subs.add(
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          result.attachments = JSON.stringify(result.attachments);
          this.store.dispatch(labsActions.saveLab({ lab: result as CreateLessonEntity }));
        }
      })
    );
  }

  deleteLab(lab: Lab) {
    const dialogData: DialogData = {
      title: 'Удаление лабораторной работы',
      body: 'лабораторную работу "' + lab.Theme + '"',
      buttonText: 'Удалить'
    };
    const dialogRef = this.dialogService.openDialog(DeletePopoverComponent, dialogData);

    this.subs.add(
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.store.dispatch(labsActions.deleteLab({ id: lab.LabId }));
        }
      })
    );
  }

  openFilePopup(attachments: Attachment[]) {
    const dialogData: DialogData = {
      title: 'Файлы',
      buttonText: 'Скачать',
      body: attachments.map(attachment => attachmentConverter(attachment))
    };
    const dialogRef = this.dialogService.openDialog(FileDownloadPopoverComponent, dialogData);

    this.subs.add(
      dialogRef.afterClosed().pipe(
        filter(r => !!r)
      ).subscribe((result: ConvertedAttachment[]) => {
        this.store.dispatch(filesActions.getAttachmentsAsZip({ attachmentsIds: result.map(r => r.id) }));
      })
    );
  }

  drop(event: CdkDragDrop<Lab[]>): void {
    const prevIndex = event.container.data.findIndex(i => i.LabId == event.item.data.LabId);
    if (prevIndex !== event.currentIndex) {
      moveItemInArray(event.container.data, prevIndex, event.currentIndex);
      this.store.dispatch(labsActions.updateOrder({ prevIndex, currentIndex: event.currentIndex }));
      this.table.renderRows();
    }
  }

  private getLab(labsCount: number, lab: Lab) {
    const order = lab ? lab.Order : labsCount + 1;
    return {
      id: lab ? lab.LabId : 0,
      theme: lab ? lab.Theme : '',
      duration: lab ? lab.Duration : '',
      order: lab ? lab.Order : order,
      pathFile: lab ? lab.PathFile : '',
      attachments: lab ? lab.Attachments.map(a => attachmentConverter(a)) : [],
      shortName: lab ? lab.ShortName : `${this.prefix}${order}`
    };
  }

}
