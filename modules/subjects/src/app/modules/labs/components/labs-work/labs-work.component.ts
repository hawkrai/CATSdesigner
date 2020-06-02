import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {LabsService} from "../../../../services/labs/labs.service";
import {Lab} from "../../../../models/lab.model";
import {select, Store} from '@ngrx/store';
import {IAppState} from '../../../../store/state/app.state';
import {getSubjectId} from '../../../../store/selectors/subject.selector';
import {DialogData} from '../../../../models/dialog-data.model';
import {ComponentType} from '@angular/cdk/typings/portal';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {LabWorkPopoverComponent} from './lab-work-popover/lab-work-popover.component';
import {Lecture} from '../../../../models/lecture.model';
import {DeletePopoverComponent} from '../../../../shared/delete-popover/delete-popover.component';
import {Attachment} from '../../../../models/attachment.model';
import {FileDownloadPopoverComponent} from '../../../../shared/file-download-popover/file-download-popover.component';

@Component({
  selector: 'app-labs-work',
  templateUrl: './labs-work.component.html',
  styleUrls: ['./labs-work.component.less']
})
export class LabsWorkComponent implements OnInit {

  @Input() teacher: boolean;

  public labsWork: Lab[];
  public displayedColumns: string[] = ['position', 'theme', 'shortName', 'clock'];

  private subjectId: string;

  constructor(private labService: LabsService,
              private store: Store<IAppState>,
              public dialog: MatDialog) { }

  ngOnInit() {
    const column = this.teacher ? 'actions' : 'download';
    this.displayedColumns.push(column);

    this.store.pipe(select(getSubjectId)).subscribe(subjectId => {
      this.subjectId = subjectId;

      this.refreshDate();
    })
  }

  refreshDate() {
    this.labService.getLabWork(this.subjectId).subscribe(res => {
      this.labsWork = res;
    })
  }

  constructorLab(lab?: Lab) {
    const newLab = this.getLab(lab);

    const dialogData: DialogData = {
      title: lab ? 'Редактирование лекции' : 'Добавление лекции',
      buttonText: 'Сохранить',
      model: newLab
    };
    const dialogRef = this.openDialog(dialogData, LabWorkPopoverComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        result.attachments = JSON.stringify(result.attachments);
        this.labService.createLab(result).subscribe(res => res['Code'] === "200" && this.refreshDate());
      }
    });
  }

  deleteLab(lab: Lab) {
    const dialogData: DialogData = {
      title: 'Удаление лекции',
      body: 'лабораторную работу "' + lab.theme + '"',
      buttonText: 'Удалить'
    };
    const dialogRef = this.openDialog(dialogData, DeletePopoverComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.labService.deleteLab({id: lab.labId, subjectId: this.subjectId})
          .subscribe(res => res['Code'] === "200" && this.refreshDate());
      }
    });
  }

  openFilePopup(attachments: Attachment[]) {
    console.log(attachments);
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

  openDialog(data: DialogData, popover: ComponentType<any>): MatDialogRef<any> {
    return this.dialog.open(popover, {data});
  }

  private getLab(lab?: Lab) {
    return {
      id: lab ? lab.labId : 0,
      subjectId: this.subjectId,
      theme: lab ? lab.theme : '',
      duration: lab ? lab.duration : '',
      order: lab ? lab.order : 0,
      pathFile: lab ? lab.pathFile : '',
      attachments: lab ? lab.attachments : [],
      shortName: lab ? lab.shortName : ''
    };
  }

}
