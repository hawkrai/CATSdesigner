import { map } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { Observable } from 'rxjs';
import {Component, ElementRef, OnDestroy, OnInit, ViewChildren} from '@angular/core';
import {News} from '../../models/news.model';
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {DeletePopoverComponent} from "../../shared/delete-popover/delete-popover.component";
import {IAppState} from "../../store/state/app.state";
import {Store} from '@ngrx/store';
import {ComponentType} from '@angular/cdk/typings/portal';
import {NewsPopoverComponent} from './news-popover/news-popover.component';
import {NewsService} from '../../services/news/news.service';
import {DialogData} from '../../models/dialog-data.model';
import {Attachment} from '../../models/attachment.model';
import * as subjectSelectors from '../../store/selectors/subject.selector';
import * as newsSelectors from '../../store/selectors/news.selectors';
import * as newsActions from '../../store/actions/news.actions';
import {SubSink} from 'subsink';

interface NewsState {
  isTeacher: boolean;
  news: News[];
  selectedNews: News
}

@Component({
  selector: 'app-subject-news',
  templateUrl: './subject-news.component.html',
  styleUrls: ['./subject-news.component.less']
})
export class SubjectNewsComponent implements OnInit, OnDestroy {

  state$: Observable<NewsState>;

  private subs = new SubSink()

  public news: News[];

  // @ViewChildren("popoverContent")
  // private popoverContent: ElementRef;

  constructor(
              private dialog: MatDialog,
              private store: Store<IAppState>) {
  }

  ngOnInit() {
    this.store.dispatch(newsActions.loadNews());
    const isTeacher$ = this.store.select(subjectSelectors.isTeacher);
    const news$ = this.store.select(newsSelectors.getNews);
    const selectedNews$ = this.store.select(newsSelectors.getSelectedNews);
    this.state$ = combineLatest([isTeacher$, news$, selectedNews$]).pipe(
      map(([isTeacher, news, selectedNews]) => ({ isTeacher, news, selectedNews }))
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    this.store.dispatch(newsActions.resetNews());
  }

  disableNews(): void {
    this.store.dispatch(newsActions.disableAllNews());
  }

  enableNews(): void {
    this.store.dispatch(newsActions.enableAllNews());
  }

  onSelectNews(news: News): void {
    this.store.dispatch(newsActions.setSelectedNews({ news }));
  }

  constructorNews(news?: News) {
    const nowDate = new Date().toISOString().split('T')[0].split('-').reverse().join('.');
    console.log(news);
    const newNews = {
      id: news ? news.id : '0',
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

    this.subs.add(
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          result.attachments = this.attachmentToModel([...result.attachments]);
          this.store.dispatch(newsActions.saveNews({ news: result }));
        }
      })
    );
  }

  deleteNews(subjectId: number, news: News) {
    const dialogData: DialogData = {
      title: 'Удаление новости',
      body: 'новость "' + news.title + '"',
      buttonText: 'Удалить',
      model: news.id
    };
    const dialogRef = this.openDialog(dialogData, DeletePopoverComponent);

    this.subs.add(
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.store.dispatch(newsActions.deleteNewsById({ id: news.id }));
        }
      })
    );
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
