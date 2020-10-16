import {Component, Input, OnDestroy, OnInit} from '@angular/core';
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
import {Swap} from '../../../../models/swap.model';
import {SubSink} from 'subsink';
import {tap} from 'rxjs/operators';

@Component({
  selector: 'app-lectures-list',
  templateUrl: './lectures-list.component.html',
  styleUrls: ['./lectures-list.component.less']
})
export class LecturesListComponent implements OnInit, OnDestroy {

  @Input() isTeacher: boolean;
  @Input() subjectId: number;
  isLoading = false;

  private subs = new SubSink();

  public tableHeaders = [
    {name: '№'},
    {name: 'Тема лекции'},
    {name: 'Количество часов'},
  ];

  public lectures: Lecture[];

  constructor(public dialog: MatDialog,
              private lecturesService: LecturesService) {
  }

  ngOnInit(): void {
    this.refreshDate();
    const column = this.isTeacher ? {name: 'Действие'} : {name: 'Скачать'};
    this.tableHeaders.push(column);
  }

  refreshDate(): void {
    this.subs.add(
      this.lecturesService.getAllLectures(this.subjectId)
        .pipe(tap(() => this.isLoading = true))
        .subscribe(lectures => {
          this.lectures = lectures && lectures.sort(lecture => +lecture.order);
          this.isLoading = false;
        }, () => this.isLoading = false)
    );
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
          window.open('http://localhost:8080/api/Upload?fileName=' + attachment.pathName + '//' + attachment.fileName)
        }, 1000)

      }
    });
  }

  constructorLecture(lecture?: Lecture) {
    const newLecture = lecture ? {...lecture} : this.getEmptyLecture();

    const dialogData: DialogData = {
      title: lecture ? 'Редактирование лекции' : 'Добавление лекции',
      buttonText: 'Сохранить',
      model: newLecture
    };
    const dialogRef = this.openDialog(dialogData, LecturePopoverComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
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

  getEmptyLecture() {
    return {
      id: '0',
      subjectId: this.subjectId,
      theme: '',
      duration: '',
      order: '',
      pathFile: '',
      attachments: [],
    };
  }

  drop(event: CdkDragDrop<string[]>): void {
    if (event.previousIndex === event.currentIndex) {
      return;
    }

    this.subs.add(
      this.lecturesService.swapLecture(
        new Swap(this.subjectId.toString(), event.previousIndex, event.currentIndex)
      ).subscribe(() => this.refreshDate())
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

}
