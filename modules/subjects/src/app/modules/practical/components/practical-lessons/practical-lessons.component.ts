import { Component, Input, OnInit, OnDestroy, SimpleChanges, AfterViewChecked, ChangeDetectorRef, ViewChild } from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {Attachment} from '../../../../models/attachment.model';
import {DialogData} from '../../../../models/dialog-data.model';
import {FileDownloadPopoverComponent} from '../../../../shared/file-download-popover/file-download-popover.component';
import {ComponentType} from '@angular/cdk/typings/portal';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {select, Store} from '@ngrx/store';
import {IAppState} from '../../../../store/state/app.state';
import {PracticalService} from '../../../../services/practical/practical.service';
import {getSubjectId} from '../../../../store/selectors/subject.selector';
import {DeletePopoverComponent} from '../../../../shared/delete-popover/delete-popover.component';
import {PracticalLessonPopoverComponent} from '../practical-lesson-popover/practical-lesson-popover.component';
import {Practical} from '../../../../models/practical.model';
import { MatTable } from '@angular/material';
@Component({
  selector: 'app-practical-lessons',
  templateUrl: './practical-lessons.component.html',
  styleUrls: ['./practical-lessons.component.less']
})
export class PracticalLessonsComponent implements OnInit, OnDestroy, AfterViewChecked {

  @Input() isTeacher: boolean;
  @ViewChild('table', { static: false }) table: MatTable<Practical>;

  public practicalLessons: Practical[];
  public practicalCopy: Practical[];
  private subjectId: number;

  public displayedColumns: string[] = [

  ];

  private defaultColumns = [
    'index',
    'theme',
    'shortName',
    'duration',
  ]

  constructor(
    public dialog: MatDialog,         
    private store: Store<IAppState>,    
    private cdRef: ChangeDetectorRef,
    private practicalService: PracticalService) { }

  ngOnInit() {
    this.store.pipe(select(getSubjectId)).subscribe(subjectId => {
      this.subjectId = subjectId;

      this.refreshDate();
    })
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.isTeacher) {
      const column = this.isTeacher ? 'actions' : 'files';
      this.displayedColumns = [...this.defaultColumns, column];
    }
  }

  ngOnDestroy(): void {
    const toSave = this.practicalLessons.filter(l => l.Order !== this.practicalCopy.find(lc => lc.PracticalId === l.PracticalId).Order);
    if (toSave.length) {
      this.practicalService.updatePracticalsOrder(toSave.map(l => ({ Id: l.PracticalId, Order: l.Order }))).subscribe();   
    }
  }

  ngAfterViewChecked(): void {
    this.cdRef.detectChanges();
  }

  refreshDate() {
    this.practicalService.getAllPracticalLessons(this.subjectId).subscribe(res => {
      this.practicalLessons = res;
      this.practicalCopy = [...res.map(p => ({ ...p }))];
    });
  }

  constructorLesson(lesson?) {
    const newLesson = this.getLesson(lesson);

    const dialogData: DialogData = {
      title: lesson ? 'Редактирование практического занятия' : 'Добавление практического занятия',
      buttonText: 'Сохранить',
      model: newLesson
    };
    const dialogRef = this.openDialog(dialogData, PracticalLessonPopoverComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        result.attachments = JSON.stringify(result.attachments);
        this.practicalService.createPracticalLessons(result).subscribe(res => res['Code'] === "200" && this.refreshDate());
      }
    });
  }

  deleteLesson(lesson) {
    const dialogData: DialogData = {
      title: 'Удаление практического занятия',
      body: 'практическое занятие "' + lesson.Theme + '"',
      buttonText: 'Удалить'
    };
    const dialogRef = this.openDialog(dialogData, DeletePopoverComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.practicalService.deletePracticalLessons({id: lesson.PracticalId, subjectId: this.subjectId})
          .subscribe(res => res['Code'] === "200" && this.refreshDate());
      }
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    const prevIndex = this.practicalLessons.findIndex(l => l.PracticalId === event.item.data.PracticalId);
    if (prevIndex === event.currentIndex) {
      return;
    }
    this.practicalLessons[prevIndex].Order = event.currentIndex;
    this.practicalLessons[event.currentIndex].Order = prevIndex;
    moveItemInArray(this.practicalLessons, prevIndex, event.currentIndex);
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

  private getLesson(lesson?) {
    return {
      id: lesson ? lesson.PracticalId : 0,
      subjectId: this.subjectId,
      theme: lesson ? lesson.Theme : '',
      duration: lesson ? lesson.Duration : '',
      order: lesson ? lesson.Order : 0,
      pathFile: lesson ? lesson.PathFile : '',
      attachments: lesson ? lesson.Attachments : [],
      shortName: lesson ? lesson.ShortName : ''
    };
  }

}
