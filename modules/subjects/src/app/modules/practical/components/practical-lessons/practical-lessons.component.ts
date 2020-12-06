import { Component, Input, OnInit, OnDestroy, SimpleChanges, AfterViewChecked, ChangeDetectorRef, ViewChild } from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {ComponentType} from '@angular/cdk/typings/portal';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {Store} from '@ngrx/store';
import { Observable } from 'rxjs';
import { MatTable } from '@angular/material';

import * as practicalsActions from '../../../../store/actions/practicals.actions';
import * as practicalsSelectors from '../../../../store/selectors/practicals.selectors';
import { CreateLessonEntity } from 'src/app/models/form/create-lesson-entity.model';
import {IAppState} from '../../../../store/state/app.state';
import {DeletePopoverComponent} from '../../../../shared/delete-popover/delete-popover.component';
import {PracticalLessonPopoverComponent} from '../practical-lesson-popover/practical-lesson-popover.component';
import {Practical} from '../../../../models/practical.model';
import {Attachment} from '../../../../models/file/attachment.model';
import {DialogData} from '../../../../models/dialog-data.model';
import {FileDownloadPopoverComponent} from '../../../../shared/file-download-popover/file-download-popover.component';
import { attachmentConverter } from 'src/app/utils';

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

  public defaultColumns = ['index', 'theme', 'shortName', 'duration'];
  public displayedColumns: string[] = this.defaultColumns;

  constructor(
    public dialog: MatDialog,         
    private store: Store<IAppState>,    
    private cdRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.store.dispatch(practicalsActions.loadPracticals());
    this.practicals$ = this.store.select(practicalsSelectors.getPracticals);
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.isTeacher) {
      const column = this.isTeacher ? 'actions' : 'files';
      this.displayedColumns = [...this.defaultColumns, column];
    }
  }

  ngOnDestroy(): void {
    this.store.dispatch(practicalsActions.resetPracticals());
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
    const dialogRef = this.openDialog(dialogData, PracticalLessonPopoverComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        result.attachments = JSON.stringify(result.attachments);
        this.store.dispatch(practicalsActions.savePractical({ practical: result as CreateLessonEntity }));
      }
    });
  }

  deleteLesson(lesson: Practical) {
    const dialogData: DialogData = {
      title: 'Удаление практического занятия',
      body: 'практическое занятие "' + lesson.Theme + '"',
      buttonText: 'Удалить'
    };
    const dialogRef = this.openDialog(dialogData, DeletePopoverComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.store.dispatch(practicalsActions.deletePractical({ id: lesson.PracticalId }));
      }
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    this.store.dispatch(practicalsActions.updateOrder({ prevIndex: event.previousIndex, currentIndex: event.currentIndex }));
    this.table.renderRows();
  }

  openFilePopup(attachments: Attachment[]) {
    const dialogData: DialogData = {
      title: 'Файлы',
      buttonText: 'Скачать',
      body: JSON.parse(JSON.stringify(attachments))
    };
    const dialogRef = this.openDialog(dialogData, FileDownloadPopoverComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.filesDownload(result)
      }
    });
  }

  filesDownload(attachments: any[]) {
    // attachments.forEach(attachment => {
    //   if (attachment.isDownload) {
    //     setTimeout(() => {
    //       window.open('http://localhost:8080/api/Upload?fileName=' + attachment.pathName + '//' + attachment.fileName)
    //     }, 1000)

    //   }
    // });
  }

  openDialog(data: DialogData, popover: ComponentType<any>): MatDialogRef<any> {
    return this.dialog.open(popover, {data});
  }

  private getLesson(lessonsCount: number, lesson: Practical) {
    const order = lesson ? lesson.Order : lessonsCount;
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
