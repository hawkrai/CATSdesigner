import { DialogService } from './../../../../services/dialog.service';
import { Component, Input, OnInit, OnDestroy, SimpleChanges, AfterViewChecked, ChangeDetectorRef, ViewChild } from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {Store} from '@ngrx/store';
import { Observable } from 'rxjs';
import { MatTable } from '@angular/material';
import { SubSink } from 'subsink';

import * as practicalsActions from '../../../../store/actions/practicals.actions';
import * as practicalsSelectors from '../../../../store/selectors/practicals.selectors';
import * as filesActions from '../../../../store/actions/files.actions';
import { CreateLessonEntity } from 'src/app/models/form/create-lesson-entity.model';
import {IAppState} from '../../../../store/state/app.state';
import {DeletePopoverComponent} from '../../../../shared/delete-popover/delete-popover.component';
import {PracticalLessonPopoverComponent} from '../practical-lesson-popover/practical-lesson-popover.component';
import {Practical} from '../../../../models/practical.model';
import {Attachment} from '../../../../models/file/attachment.model';
import {DialogData} from '../../../../models/dialog-data.model';
import {FileDownloadPopoverComponent} from '../../../../shared/file-download-popover/file-download-popover.component';
import { filter } from 'rxjs/operators';
import { TranslatePipe } from 'educats-translate';

@Component({
  selector: 'app-practical-lessons',
  templateUrl: './practical-lessons.component.html',
  styleUrls: ['./practical-lessons.component.less']
})
export class PracticalLessonsComponent implements OnInit, OnDestroy, AfterViewChecked {

  @Input() isTeacher: boolean;
  @ViewChild('table', { static: false }) table: MatTable<Practical>;

  public practicals: Practical[];
  private subs = new SubSink();

  constructor(    
    private store: Store<IAppState>,    
    private cdRef: ChangeDetectorRef,
    private translate: TranslatePipe,
    private dialogService: DialogService) { }

  ngOnInit() {
    this.store.dispatch(practicalsActions.loadPracticals());
    this.subs.add(this.store.select(practicalsSelectors.selectPracticals).subscribe(practicals => {
      this.practicals = [...practicals]
    }));
  }
  

  getDisplayedColumns(): string[] {
    const defaultColumns = ['index', 'theme', 'shortName', 'duration', 'files'];;
    if (this.isTeacher) {
      return defaultColumns.concat('actions');
    }
    return defaultColumns;
  }

  ngOnDestroy(): void {
    this.store.dispatch(practicalsActions.resetPracticals());
    this.subs.unsubscribe();
  }

  ngAfterViewChecked(): void {
    this.cdRef.detectChanges();
  }

  constructorLesson(lessonsCount: number, lesson: Practical) {
    const newLesson = this.getLesson(lessonsCount, lesson);

    const dialogData: DialogData = {
      title: lesson ? 
        this.translate.transform('text.subjects.practicals.editing', 'Редактирование практического занятия') : 
        this.translate.transform('text.subjects.practicals.adding', 'Добавление практического занятия'),
      buttonText: this.translate.transform('button.save', 'Сохранить'),
      model: newLesson
    };
    const dialogRef = this.dialogService.openDialog(PracticalLessonPopoverComponent, dialogData);

    this.subs.add(
      dialogRef.afterClosed().pipe(
        filter(r => !!r)
      )
      .subscribe(result => {
        result.attachments = JSON.stringify(result.attachments);
        this.store.dispatch(practicalsActions.savePractical({ practical: result as CreateLessonEntity }));
      })
    );
  }

  deleteLesson(lesson: Practical) {
    const dialogData: DialogData = {
      title: this.translate.transform('text.subjects.practicals.deleting', 'Удаление практического занятия'),
      body: `${this.translate.transform('text.subjects.practicals', 'практическое занятие').toLowerCase()} "${lesson.Theme}"`,
      buttonText: this.translate.transform('button.delete', 'Удалить')
    };
    const dialogRef = this.dialogService.openDialog(DeletePopoverComponent, dialogData);

    this.subs.add(
      dialogRef.afterClosed()
      .pipe(
        filter(r => !!r)
      )
      .subscribe(() => {
        this.store.dispatch(practicalsActions.deletePractical({ id: lesson.PracticalId }));
      })
    );
  }

  drop(event: CdkDragDrop<Practical[]>) {
    const prevIndex = event.container.data.findIndex(i => i.PracticalId == event.item.data.PracticalId);
    if (prevIndex !== event.currentIndex) {
      moveItemInArray(event.container.data, prevIndex, event.currentIndex);
      this.store.dispatch(practicalsActions.updateOrder({ prevIndex, currentIndex: event.currentIndex }));
      this.table.renderRows();
    }
  }

  openFilePopup(attachments: Attachment[]) {
    const dialogData: DialogData = {
      title: this.translate.transform('text.attachments.plural', 'Файлы'),
      buttonText: this.translate.transform('text.download', 'Скачать'),
      body: attachments
    };
    const dialogRef = this.dialogService.openDialog(FileDownloadPopoverComponent, dialogData);

    this.subs.add(
      dialogRef.afterClosed().pipe(
        filter(r => !!r)
      ).subscribe((result: Attachment[]) => {
        this.store.dispatch(filesActions.getAttachmentsAsZip({ attachmentsIds: result.map(r => r.Id) }));
      })
    );
  }

  private getLesson(lessonsCount: number, lesson: Practical) {
    const order = lesson ? lesson.Order : lessonsCount;
    return {
      id: lesson ? lesson.PracticalId : 0,
      theme: lesson ? lesson.Theme : '',
      duration: lesson ? lesson.Duration : 1,
      order,
      pathFile: lesson ? lesson.PathFile : '',
      attachments: lesson ? lesson.Attachments : [],
      shortName: `ПЗ№${order + 1}`
    };
  }

}
