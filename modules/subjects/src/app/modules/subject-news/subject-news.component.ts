import {Component, ElementRef, OnDestroy, OnInit, ViewChildren} from '@angular/core';
import {News} from '../../models/news.model';
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {DeletePopoverComponent} from "../../shared/delete-popover/delete-popover.component";
import {IAppState} from "../../store/state/app.state";
import {select, Store} from '@ngrx/store';
import {takeUntil} from 'rxjs/operators';
import {Observable, Subject} from 'rxjs';
import {ComponentType} from '@angular/cdk/typings/portal';
import {NewsPopoverComponent} from './news-popover/news-popover.component';
import {NewsService} from '../../services/news/news.service';
import {DialogData} from '../../models/dialog-data.model';
import {Attachment} from '../../models/attachment.model';
import * as subjectSelectors from '../../store/selectors/subject.selector';
import {SubSink} from 'subsink';

@Component({
  selector: 'app-subject-news',
  templateUrl: './subject-news.component.html',
  styleUrls: ['./subject-news.component.less']
})
export class SubjectNewsComponent implements OnInit, OnDestroy {

  isTeacher$: Observable<boolean>;
  private subs = new SubSink()
  private subjectId: number;

  public news: News[];
  public selectNews: News = null;
  private unsubscription$: Subject<any> = new Subject();

  @ViewChildren("popoverContent")
  private popoverContent: ElementRef;

  constructor(private newsService: NewsService,
              public dialog: MatDialog,
              private store: Store<IAppState>) {
  }

  ngOnInit() {
    this.isTeacher$ = this.store.select(subjectSelectors.isUserLector);
    this.subs.add(
      this.store.pipe(select(subjectSelectors.getSubjectId)).subscribe(subjectId => this.subjectId = subjectId)
    );

    this.newsService.loadData();
    this.refreshDate();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  refreshDate() {
    this.newsService.getAllNews()
      .pipe(
        takeUntil(this.unsubscription$)
      )
      .subscribe(
        (news: News[]) => {
          this.news = news;
        }
      )
  }

  disableNews() {
    this.newsService.disableAllNews(this.subjectId);
  }

  enableNews() {
    this.newsService.enableAllNews(this.subjectId);
  }

  constructorNews(news?: News) {
    const nowDate = new Date().toISOString().split('T')[0].split('-').reverse().join('.');
    const newNews = {
      id: news ? news.id : '0',
      subjectId: this.subjectId,
      title: news ? news.title : '',
      body: news ? news.body : '',
      disabled: news ? news.disabled : false,
      isOldDate: false,
      dateCreate: news ? news.dateCreate : nowDate,
      attachments: news ? news.attachments : []
    };
    const dialogData: DialogData = {
      title: news ? 'Редактирование новости' : 'Добавление новости',
      buttonText: 'Сохранить',
      model: newNews
    };
    const dialogRef = this.openDialog(dialogData, NewsPopoverComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        result.attachments = this.attachmentToModel([...result.attachments]);
        news ? this.newsService.updateNews(result) : this.newsService.createNews(result);
      }
    });
  }

  deleteNews(news: News) {
    const dialogData: DialogData = {
      title: 'Удаление новости',
      body: 'новость "' + news.title + '"',
      buttonText: 'Удалить',
      model: news.id
    };
    const dialogRef = this.openDialog(dialogData, DeletePopoverComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.newsService.deleteNews(news.id, this.subjectId)
      }
    });
  }

  openDialog(data: DialogData, popover: ComponentType<any>): MatDialogRef<any> {
    return this.dialog.open(popover, {data});
  }

  _filesDownload(attachment: any) {
    window.open('http://localhost:8080/api/Upload?fileName=' + attachment.PathName + '//' + attachment.FileName)
  }

  public attachmentToModel(attachments: Attachment[]) {
    const newAttachments = [];
    attachments.forEach(attachment => {
      newAttachments.push({
        FileName: attachment.fileName,
        PathName: attachment.pathName,

        Name: attachment.name
      })
    });
    return newAttachments
  }
}
