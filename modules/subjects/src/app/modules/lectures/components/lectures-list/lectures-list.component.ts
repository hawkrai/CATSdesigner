import { Observable } from 'rxjs';
import { AfterViewChecked } from '@angular/core';
import { SubSink } from 'subsink';
import { MatTable } from '@angular/material';
import { ChangeDetectorRef, OnChanges, OnDestroy, SimpleChanges, ViewChild } from '@angular/core';
import {Component, Input, OnInit} from '@angular/core';
import { Store } from '@ngrx/store';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { filter } from 'rxjs/operators';

import { IAppState } from 'src/app/store/state/app.state';
import {LecturePopoverComponent} from '../lecture-popover/lecture-popover.component';
import {DeletePopoverComponent} from '../../../../shared/delete-popover/delete-popover.component';
import {FileDownloadPopoverComponent} from '../../../../shared/file-download-popover/file-download-popover.component';
import {Lecture} from '../../../../models/lecture.model';
import {Attachment} from "../../../../models/file/attachment.model";
import {DialogData} from '../../../../models/dialog-data.model';
import * as lecturesActions from '../../../../store/actions/lectures.actions';
import * as lecturesSelectors from '../../.././../store/selectors/lectures.selectors';
import { DialogService } from './../../../../services/dialog.service';
import * as filesActions from '../../../../store/actions/files.actions';
import { MediaMatcher } from '@angular/cdk/layout';
import { FilterOp } from 'src/app/shared/pipes/filter.pipe';
import { TranslatePipe } from 'educats-translate';

@Component({
  selector: 'app-lectures-list',
  templateUrl: './lectures-list.component.html',
  styleUrls: ['./lectures-list.component.less']
})
export class LecturesListComponent implements OnInit, OnDestroy, AfterViewChecked {
  @Input() isTeacher: boolean;
  @Input() subjectId: number;
  private subs = new SubSink();
  @ViewChild('table', { static: false }) table: MatTable<Lecture>;

  public tabletMatcher: MediaQueryList;
  public lectures: Lecture[];
  searchValue: string = '';
  filterOps = FilterOp;

  constructor(
    private store: Store<IAppState>,
    private dialogService: DialogService,
    private translate: TranslatePipe,
    private cdRef: ChangeDetectorRef,
    private mediaMatcher: MediaMatcher) {
  }

  ngOnInit(): void {
    this.store.dispatch(lecturesActions.loadLectures());
    this.subs.add(this.store.select(lecturesSelectors.getLectures).subscribe(lectures => {
      this.lectures = [...lectures];
    }));
    this.addMediaMatchers();
  }

  private addMediaMatchers(): void {
    this.tabletMatcher = this.mediaMatcher.matchMedia('(max-width: 500px)');
    this.tabletMatcher.addEventListener('change', this.emptyListner);

  }

  private cleanMediaMatchers(): void {
    this.tabletMatcher.removeEventListener('change', this.emptyListner);

  }

  private emptyListner() {}

  getDisplayedColumns(): string[] {
    const defaultColumns = ['index', 'theme', 'duration', 'files'];
    if (this.isTeacher) {
      return defaultColumns.concat('actions');
    }
    return defaultColumns;
  }

  ngAfterViewChecked(): void {
    this.cdRef.detectChanges();
  }

  ngOnDestroy(): void {
    this.cleanMediaMatchers();
    this.subs.unsubscribe();
    this.store.dispatch(lecturesActions.resetLectures());
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

  constructorLecture(lecturesCount: number, lecture: Lecture) {
    const newLecture = this.getLecture(lecturesCount, lecture);
    const dialogData: DialogData = {
      title: lecture ? 
        this.translate.transform('text.subjects.lectures.editing', 'Редактирование темы лекции') : 
        this.translate.transform('text.subjects.lectures.adding', 'Добавление темы лекции'),
      buttonText: this.translate.transform('button.save', 'Сохранить'),
      model: newLecture
    };
    const dialogRef = this.dialogService.openDialog(LecturePopoverComponent, dialogData);
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
      title: this.translate.transform('text.subjects.lectures.deleting', 'Удаление лекции'),
      body: `${this.translate.transform('text.lectures.accusative', 'Лекцию').toLowerCase()} "` + lecture.Theme + '"',
      buttonText: this.translate.transform('button.delete', 'Удалить'),
      model: lecture.LecturesId
    };
    const dialogRef = this.dialogService.openDialog(DeletePopoverComponent, dialogData);

    this.subs.add(
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.store.dispatch(lecturesActions.deleteLecture({ id: lecture.LecturesId }));
        }
      })
    );
  }

  private getLecture(lecturesCount: number, lecture: Lecture) {
    return {
      id: lecture ? lecture.LecturesId : 0,
      theme: lecture ? lecture.Theme : '',
      duration: lecture ? lecture.Duration : 1,
      order: lecture ? lecture.Order : lecturesCount,
      pathFile: lecture ? lecture.PathFile : '',
      attachments: lecture ? lecture.Attachments : [],
    };
  }

  drop(event: CdkDragDrop<Lecture[]>): void {
    const prevIndex = event.container.data.findIndex(i => i.LecturesId == event.item.data.LecturesId);
    if (prevIndex !== event.currentIndex) {
      moveItemInArray(event.container.data, prevIndex, event.currentIndex);
      this.store.dispatch(lecturesActions.updateOrder({ prevIndex, currentIndex: event.currentIndex }));
      this.table.renderRows();
    }
  }

}
