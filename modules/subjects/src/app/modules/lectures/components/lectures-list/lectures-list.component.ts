import { AfterViewChecked } from '@angular/core';
import { MatTable } from '@angular/material';
import { ChangeDetectorRef, OnChanges, OnDestroy, SimpleChanges, ViewChild } from '@angular/core';
import {Component, Input, OnInit} from '@angular/core';
import {Lecture} from '../../../../models/lecture.model';
import {Attachment} from "../../../../models/attachment.model";
import {DialogData} from '../../../../models/dialog-data.model';
import {ComponentType} from '@angular/cdk/typings/portal';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {LecturePopoverComponent} from '../lecture-popover/lecture-popover.component';
import {DeletePopoverComponent} from '../../../../shared/delete-popover/delete-popover.component';
import {LecturesService} from '../../../../services/lectures/lectures.service';
import {FileDownloadPopoverComponent} from '../../../../shared/file-download-popover/file-download-popover.component';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-lectures-list',
  templateUrl: './lectures-list.component.html',
  styleUrls: ['./lectures-list.component.less']
})
export class LecturesListComponent implements OnInit, OnDestroy, AfterViewChecked, OnChanges {
  @Input() isTeacher: boolean;
  @Input() subjectId: number;
  @ViewChild('table', { static: false }) table: MatTable<Lecture>;

  isLoading = false;


  displayedColumns: string[] = ['index', 'theme', 'duration', ];


  public lectures: Lecture[];
  private lecturesCopy: Lecture[];

  constructor(public dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
              private lecturesService: LecturesService) {
  }

  ngOnInit(): void {
    this.refreshDate();
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
    const toSave = this.lectures.filter(l => l.order !== this.lecturesCopy.find(lc => lc.id === l.id).order);
    if (toSave.length) {
      this.lecturesService.updateLecturesOrder(toSave.map(l => ({ Id: +l.id, Order: +l.order }))).subscribe();   
    }
  }

  refreshDate() {
    this.lecturesService.getAllLectures(this.subjectId).subscribe(lectures => {
      console.log(lectures)
      this.lectures = lectures && lectures.sort(lecture => +lecture.order);
      this.lecturesCopy = [...this.lectures.map(l => ({ ...l }))];
    });
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
        this._filesDownload(result)
      }
    });
  }

  _filesDownload(attachments: any[]) {
    attachments.forEach(attachment => {
      if (attachment.isDownload) {
        setTimeout(() => {
          window.open('/api/Upload?fileName=' + attachment.pathName + '//' + attachment.fileName)
        }, 1000)

      }
    });
  }

  constructorLecture(lecture?: Lecture) {
    const newLecture = lecture ? { ...lecture } : this.getEmptyLecture();
    const dialogData: DialogData = {
      title: lecture ? 'Редактирование темы лекции' : 'Добавление темы лекции',
      buttonText: 'Сохранить',
      model: newLecture
    };
    const dialogRef = this.openDialog(dialogData, LecturePopoverComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log()
        result.attachments = JSON.stringify(result.attachments);
        this.lecturesService.createLecture(result).subscribe(res => res['Code'] === "200" && this.refreshDate());
      }
    });
  }

  deleteLectures(lecture: Lecture) {
    const dialogData: DialogData = {
      title: 'Удаление лекции',
      body: 'лекцию "' + lecture.theme + '"',
      buttonText: 'Удалить',
      model: lecture.id
    };
    const dialogRef = this.openDialog(dialogData, DeletePopoverComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.lecturesService.deleteLecture({id: lecture.id, subjectId: this.subjectId})
          .subscribe(res => res['Code'] === "200" && this.refreshDate());
      }
    });
  }

  openDialog(data: DialogData, popover: ComponentType<any>): MatDialogRef<any> {
    return this.dialog.open(popover, {data});
  }

  getEmptyLecture(): Lecture {
    return {
      id: '0',
      subjectId: this.subjectId.toString(),
      theme: '',
      duration: '',
      order: (this.lectures.length - 1).toString(),
      pathFile: '',
      attachments: [],
    };
  }

  drop(event: CdkDragDrop<Lecture[]>): void {
    const prevIndex = this.lectures.findIndex(l => l.id === event.item.data.id);
    if (prevIndex === event.currentIndex) {
      return;
    }
    this.lectures[prevIndex].order = event.currentIndex.toString();
    this.lectures[event.currentIndex].order = prevIndex.toString();
    moveItemInArray(this.lectures, prevIndex, event.currentIndex);
    this.table.renderRows();
  }

}
