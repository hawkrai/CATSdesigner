import {Component, EventEmitter, Input, OnInit} from '@angular/core';
import {LabsService} from '../../../../services/labs/labs.service';
import {select, Store} from '@ngrx/store';
import {IAppState} from '../../../../store/state/app.state';
import {getSubjectId, getUser} from '../../../../store/selectors/subject.selector';
import {DialogData} from '../../../../models/dialog-data.model';
import {ComponentType} from '@angular/cdk/typings/portal';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {AddLabPopoverComponent} from './add-lab-popover/add-lab-popover.component';
import {DeletePopoverComponent} from '../../../../shared/delete-popover/delete-popover.component';
import {User} from '../../../../models/user.model';
import {getCurrentGroup} from '../../../../store/selectors/groups.selectors';
import {filter} from 'rxjs/operators';
import {CheckPlagiarismStudentComponent} from './check-plagiarism-student/check-plagiarism-student.component';

@Component({
  selector: 'app-job-protection',
  templateUrl: './job-protection.component.html',
  styleUrls: ['./job-protection.component.less']
})
export class JobProtectionComponent implements OnInit {

  @Input() teacher: boolean;
  @Input() refresh: EventEmitter<any>;

  public files;
  public students;
  public openedPanelId = 0;

  public numberSubGroups: number[] = [];
  public subjectId: string;
  public user: User;
  public displayedColumns = ['files', 'comments', 'date', 'action'];

  constructor(private labService: LabsService,
              private store: Store<IAppState>,
              public dialog: MatDialog) {
  }

  ngOnInit() {
    this.store.pipe(select(getSubjectId)).subscribe(subjectId => {
      this.subjectId = subjectId;
      this.refreshDate();
    });

    let date = new Date();
    this.refresh.subscribe(res => {
      if (this.subjectId) {
        this.students = null;
        this.refreshDate(date);
      }
      date = res;
    })
  }

  refreshDate(date?) {
    if (this.teacher) {
      this.store.pipe(select(getCurrentGroup))
        .pipe(filter(group => !!group))
        .subscribe(group => {
          this.labService.getAllStudentFilesLab(this.subjectId, group.groupId).subscribe(students => {
            this.students = date ? this.setPriority(date, students) : students;
            students.forEach(student => {
              if (!this.numberSubGroups.includes(student.SubGroup)) {
                this.numberSubGroups.push(student.SubGroup);
                this.numberSubGroups.sort((a, b) => a-b)
              }
            })
          })
        })
    } else {
      this.store.pipe(select(getUser))
        .pipe(filter(user => !!user))
        .subscribe(user => {
          this.user = user;
          this.labService.getFilesLab({subjectId: this.subjectId, userId: this.user.id}).subscribe(files => {
            this.files = files;
          })
        })
    }
  }

  downloadFile(attachment) {
    window.open('http://localhost:8080/api/Upload?fileName=' + attachment.PathName + '//' + attachment.FileName)
  }

  setPriority(date, student) {
    student.map(student => {
      let isNew = false;
      student.FileLabs.map(file => {
        if (new Date(file.Date) > date) {
          file.isNew = true;
          isNew = true;
        }
      });
      student.isNew = isNew;
    });
    return student;
  }

  addLab(file?) {
    let body = {comments: '', attachments: []};
    if (!this.teacher && file) {
      body = {comments: file.Comments, attachments: file.Attachments}
    }
    const dialogData: DialogData = {
      title: this.teacher ? 'Загрузить исправленный вариант работы' : 'На защиту лабораторной работы',
      buttonText: 'Отправить работу',
      body: body,
      model: this.teacher ? 'Комментарий (необязательно)' : 'Комментарий (Например, Лабораторная работа №1)'
    };
    const dialogRef = this.openDialog(dialogData, AddLabPopoverComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.labService.sendUserFile(this.getSendFile(result, file)).subscribe(
          res => res.Code === '200' && this.refreshDate()
        )
      }
    });
  }

  cancelReceivedLabFile(file) {
    this.labService.cancelReceivedLabFile({userFileId: file.Id}).subscribe(
      res => res.Code === '200' && this.refreshDate()
    )
  }

  receivedLabFile(file) {
    this.labService.receivedLabFile({userFileId: file.Id}).subscribe(
      res => res.Code === '200' && this.refreshDate()
    )
  }

  checkPlagiarism(file) {
    const dialogData: DialogData = {
      body: {subjectId: this.subjectId, userFileId: file.Id}
    };
    this.openDialog(dialogData, CheckPlagiarismStudentComponent);
  }

  deleteLabWork(file) {
    const dialogData: DialogData = {
      title: 'Удаление работы',
      body: 'работу',
      buttonText: 'Удалить'
    };
    const dialogRef = this.openDialog(dialogData, DeletePopoverComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.labService.deleteUserFile({id: file.Id}).subscribe(
          res => res.Code === '200' && this.refreshDate()
        )
      }
    });
  }

  openDialog(data: DialogData, popover: ComponentType<any>): MatDialogRef<any> {
    return this.dialog.open(popover, {data});
  }

  getSendFile(data: { comments: string, attachments: any[] }, file?) {
    return {
      attachments: JSON.stringify(data.attachments),
      comments: data.comments,
      id: file ? file.Id : '0',
      isCp: false,
      isRet: this.teacher,
      pathFile: file ? file.Attachments[0].PathName : '',
      subjectId: this.subjectId,
      userId: this.user.id.toString()
    }
  }

}
