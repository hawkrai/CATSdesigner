import { DialogService } from './../../../../services/dialog.service';
import { Observable } from 'rxjs';
import { AfterViewChecked } from '@angular/core';
import { SubSink } from 'subsink';
import { MatTable } from '@angular/material';
import { ChangeDetectorRef, OnChanges, OnDestroy, SimpleChanges, ViewChild } from '@angular/core';
import {Component, Input, OnInit} from '@angular/core';
import { Store } from '@ngrx/store';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

import { IAppState } from 'src/app/store/state/app.state';
import {LecturePopoverComponent} from '../lecture-popover/lecture-popover.component';
import {DeletePopoverComponent} from '../../../../shared/delete-popover/delete-popover.component';
import {FileDownloadPopoverComponent} from '../../../../shared/file-download-popover/file-download-popover.component';
import {Lecture} from '../../../../models/lecture.model';
import {Attachment} from "../../../../models/file/attachment.model";
import {DialogData} from '../../../../models/dialog-data.model';
import * as lecturesActions from '../../../../store/actions/lectures.actions';
import * as lecturesSelectors from '../../.././../store/selectors/lectures.selectors';

@Component({
  selector: 'app-lectures-list',
  templateUrl: './lectures-list.component.html',
  styleUrls: ['./lectures-list.component.less']
})
export class LecturesListComponent implements OnInit, OnDestroy, AfterViewChecked, OnChanges {
  @Input() isTeacher: boolean;
  @Input() subjectId: number;
  private subs = new SubSink();
  @ViewChild('table', { static: false }) table: MatTable<Lecture>;

  displayedColumns: string[] = ['index', 'theme', 'duration', ];


  public lectures$: Observable<Lecture[]>;

  constructor(
    private store: Store<IAppState>,
    private dialogService: DialogService,
    private cdRef: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.store.dispatch(lecturesActions.loadLectures());
    this.lectures$ = this.store.select(lecturesSelectors.getLectures);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.isTeacher) {
      if (this.isTeacher) {
        this.displayedColumns.push('actions');
      }
      else {
        this.displayedColumns.push('files');
      }
    }
  }

  ngAfterViewChecked(): void {
    this.cdRef.detectChanges();
  }

  ngOnDestroy(): void {
    // const toSave = this.lectures.filter(l => l.Order !== this.lecturesCopy.find(lc => lc.LecturesId === l.LecturesId).Order);
    // if (toSave.length) {
    //   this.lecturesService.updateLecturesOrder(toSave.map(l => ({ Id: l.LecturesId, Order: l.Order }))).subscribe();   
    // }
    this.subs.unsubscribe();
    this.store.dispatch(lecturesActions.resetLectures());
  }

  openFilePopup(attachments: Attachment[]) {
    const dialogData: DialogData = {
      title: 'Файлы',
      buttonText: 'Скачать',
      body: JSON.parse(JSON.stringify(attachments))
    };
    const dialogRef = this.dialogService.openDialog(dialogData, FileDownloadPopoverComponent);

    this.subs.add(
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.filesDownload(result)
        }
      })
    );
  }

  filesDownload(attachments: Attachment[]) {
    // attachments.forEach(attachment => {
    //   if (attachment.isDownload) {
    //     setTimeout(() => {
    //       window.open('/api/Upload?fileName=' + attachment.pathName + '//' + attachment.fileName)
    //     }, 1000)

    //   }
    // });
  }

  constructorLecture(lecturesCount: number, lecture?: Lecture) {
    const newLecture = lecture ? { ...lecture } : this.getEmptyLecture(lecturesCount);
    const dialogData: DialogData = {
      title: lecture ? 'Редактирование темы лекции' : 'Добавление темы лекции',
      buttonText: 'Сохранить',
      model: newLecture
    };
    const dialogRef = this.dialogService.openDialog(dialogData, LecturePopoverComponent);
    this.subs.add(
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          result.attachments = JSON.stringify(result.attachments);
          this.store.dispatch(lecturesActions.saveLecture({ lecture: result }));
        }
      })
    );
  }

  deleteLectures(lecture: Lecture) {
    const dialogData: DialogData = {
      title: 'Удаление лекции',
      body: 'лекцию "' + lecture.Theme + '"',
      buttonText: 'Удалить',
      model: lecture.LecturesId
    };
    const dialogRef = this.dialogService.openDialog(dialogData, DeletePopoverComponent);

    this.subs.add(
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.store.dispatch(lecturesActions.deleteLecture({ id: lecture.LecturesId }));
        }
      })
    );
  }


  getEmptyLecture(lecturesCount: number) {
    return {
      id: 0,
      subjectId: this.subjectId,
      theme: '',
      duration: 0,
      order: lecturesCount + 1,
      pathFile: '',
      attachments: [],
    };
  }

  drop(event: CdkDragDrop<Lecture[]>): void {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    this.store.dispatch(lecturesActions.updateOrder({ prevIndex: event.previousIndex, currentIndex: event.currentIndex }));
    this.table.renderRows();
  }

}
