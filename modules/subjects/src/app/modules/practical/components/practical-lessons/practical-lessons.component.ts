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
import { attachmentConverter } from 'src/app/utils';
import { filter } from 'rxjs/operators';
import { ConvertedAttachment } from 'src/app/models/file/converted-attachment.model';

@Component({
  selector: 'app-practical-lessons',
  templateUrl: './practical-lessons.component.html',
  styleUrls: ['./practical-lessons.component.less']
})
export class PracticalLessonsComponent implements OnInit, OnDestroy, AfterViewChecked {

  @Input() isTeacher: boolean;
  @ViewChild('table', { static: false }) table: MatTable<Practical>;

  public practicals$: Observable<Practical[]>;
  private prefix = 'ПР';
  private subs = new SubSink();

  public defaultColumns = ['index', 'theme', 'shortName', 'duration'];
  public displayedColumns: string[] = this.defaultColumns;

  constructor(    
    private store: Store<IAppState>,    
    private cdRef: ChangeDetectorRef,
    private dialogService: DialogService) { }

  ngOnInit() {
    this.store.dispatch(practicalsActions.loadPracticals());
    this.practicals$ = this.store.select(practicalsSelectors.selectPracticals);
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.isTeacher) {
      const column = this.isTeacher ? 'actions' : 'files';
      this.displayedColumns = [...this.defaultColumns, column];
    }
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
      title: lesson ? 'Редактирование практического занятия' : 'Добавление практического занятия',
      buttonText: 'Сохранить',
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
      title: 'Удаление практического занятия',
      body: 'практическое занятие "' + lesson.Theme + '"',
      buttonText: 'Удалить'
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
      title: 'Файлы',
      buttonText: 'Скачать',
      body: attachments.map(a => attachmentConverter(a))
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

  private getLesson(lessonsCount: number, lesson: Practical) {
    const order = lesson ? lesson.Order : lessonsCount + 1;
    return {
      id: lesson ? lesson.PracticalId : 0,
      theme: lesson ? lesson.Theme : '',
      duration: lesson ? lesson.Duration : '',
      order,
      pathFile: lesson ? lesson.PathFile : '',
      attachments: lesson ? lesson.Attachments.map(a => attachmentConverter(a)) : [],
      shortName: lesson ? lesson.ShortName : `${this.prefix}${order}`
    };
  }

}
