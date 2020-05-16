import {Component, Input, OnInit} from '@angular/core';
import {MDCDialog} from '@material/dialog';
import {Lecture} from '../../../../models/lecture.model';
import {Attachment} from "../../../../models/attachment.model";
import {DialogData} from '../../../../models/dialog-data.model';
import {ComponentType} from '@angular/cdk/typings/portal';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {LecturePopoverComponent} from '../lecture-popover/lecture-popover.component';
import {DeletePopoverComponent} from '../../../../shared/delete-popover/delete-popover.component';
import {LecturesService} from '../../../../services/lectures/lectures.service';

@Component({
  selector: 'app-lectures-list',
  templateUrl: './lectures-list.component.html',
  styleUrls: ['./lectures-list.component.less']
})
export class LecturesListComponent implements OnInit {

  @Input() teacher: boolean;
  @Input()  subjectId: string;

  public tableHeaders = [
    {name: '№'},
    {name: 'Тема лекции'},
    {name: 'Количество часов'},
  ];
  public selectedAttachments: Attachment[];

  public lectures: Lecture[];

  constructor(public dialog: MatDialog,
              private lecturesService: LecturesService) {
  }

  ngOnInit() {
    this.refreshDate();
    const column = this.teacher ? {name: 'Действие'} : {name: 'Скачать'};
    this.tableHeaders.push(column);
  }

  refreshDate() {
    this.lecturesService.getAllLectures(this.subjectId).subscribe(lectures => {
      this.lectures = lectures && lectures.sort(lecture => +lecture.order);
    });
  }

  _openPopup(attachments: Attachment[]) {
    this.selectedAttachments = attachments;
    const dialog = new MDCDialog(document.querySelector('.mdc-dialog'));
    dialog.open();
  }

  _filesDownload() {
    console.log()
  }

  constructorLecture(lecture?: Lecture) {
    const newLecture = lecture ? {...lecture} : this.getEmptyLecture();
    newLecture.attachments = JSON.stringify(newLecture.attachments);

    const dialogData: DialogData = {
      title: lecture ? 'Редактирование лекции' : 'Добавление лекции',
      buttonText: 'Сохранить',
      model: newLecture
    };
    const dialogRef = this.openDialog(dialogData, LecturePopoverComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
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

}
