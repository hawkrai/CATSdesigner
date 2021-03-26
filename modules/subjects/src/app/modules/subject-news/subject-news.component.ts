import { DialogService } from './../../services/dialog.service';
import { map } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { Observable } from 'rxjs';
import {Component, OnDestroy, OnInit } from '@angular/core';
import {News} from '../../models/news.model';
import {DeletePopoverComponent} from "../../shared/delete-popover/delete-popover.component";
import {IAppState} from "../../store/state/app.state";
import {Store} from '@ngrx/store';
import {NewsPopoverComponent} from './news-popover/news-popover.component';
import {DialogData} from '../../models/dialog-data.model';
import {Attachment} from '../../models/file/attachment.model';
import * as subjectSelectors from '../../store/selectors/subject.selector';
import * as newsSelectors from '../../store/selectors/news.selectors';
import * as newsActions from '../../store/actions/news.actions';
import * as filesActions from '../../store/actions/files.actions';
import {SubSink} from 'subsink';
import { attachmentConverter } from 'src/app/utils';
import { TranslatePipe } from '../../../../../../container/src/app/pipe/translate.pipe';

interface NewsState {
  color: string
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

  constructor(
    private dialogService: DialogService,
    private translate: TranslatePipe,
    private store: Store<IAppState>) {
  }

  ngOnInit() {
    this.store.dispatch(newsActions.loadNews());
    this.state$ = combineLatest(
      this.store.select(subjectSelectors.getSubjectColor),
      this.store.select(subjectSelectors.isTeacher), 
      this.store.select(newsSelectors.getNews),
      this.store.select(newsSelectors.getSelectedNews)).pipe(
      map(([color, isTeacher, news, selectedNews]) => ({ color, isTeacher, news, selectedNews }))
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    this.store.dispatch(newsActions.resetNews());
  }

  disableNews(disable: boolean): void {
    this.store.dispatch(disable ? newsActions.disableAllNews() : newsActions.enableAllNews());
  }

  onSelectNews(news: News): void {
    this.store.dispatch(newsActions.setSelectedNews({ news }));
  }

  constructorNews(news: News): void {
    const newNews = this.createNews(news);
    const dialogData: DialogData = {
      title: news ? this.translate.transform('text.subjects.news.editing', 'Редактирование новости') : this.translate.transform('text.subjects.news.adding', 'Добавление новости'),
      buttonText: this.translate.transform('button.save', 'Сохранить'),
      model: newNews
    };
    const dialogRef = this.dialogService.openDialog(NewsPopoverComponent, dialogData);

    this.subs.add(
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          result.attachments = JSON.stringify(result.attachments);
          this.store.dispatch(newsActions.saveNews({ news: result }));
        }
      })
    );
  }

  deleteNews(news: News) {
    const dialogData: DialogData = {
      title: this.translate.transform('text.subjects.news.deleting', 'Удаление новости'),
      body: `${this.translate.transform('text.news.accusative', 'Новость').toLowerCase()} "` + news.Title + '"',
      buttonText: this.translate.transform('button.delete', 'Удалить'),
      model: news.NewsId
    };
    const dialogRef = this.dialogService.openDialog(DeletePopoverComponent, dialogData);

    this.subs.add(
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.store.dispatch(newsActions.deleteNewsById({ id: news.NewsId }));
        }
      })
    );
  }

  fileDownload(attachment: Attachment) {
    this.store.dispatch(filesActions.downloadFile({ pathName: attachment.PathName, fileName: attachment.FileName }));
  }

  private createNews(news: News) {
    const nowDate = new Date().toISOString().split('T')[0].split('-').reverse().join('.');
    const newNews = {
      id: news ? news.NewsId : '0',
      title: news ? news.Title : '',
      body: news ? news.Body : '',
      disabled: news ? news.Disabled : false,
      isOldDate: false,
      dateCreate: news ? news.DateCreate : nowDate,
      pathFile: news ? news.PathFile : '',
      attachments: news ? news.Attachments.map(attachment => attachmentConverter(attachment)) : []
    };
    return newNews;
  }
}
