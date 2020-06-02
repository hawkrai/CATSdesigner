import {Component, ElementRef, OnInit, ViewChildren} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {News} from '../../models/news.model';
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {DeletePopoverComponent} from "../../shared/delete-popover/delete-popover.component";
import {IAppState} from "../../store/state/app.state";
import {select, Store} from '@ngrx/store';
import {getSubjectId, getUser} from "../../store/selectors/subject.selector";
import {getNews} from "../../store/selectors/news.selectors";
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {ComponentType} from '@angular/cdk/typings/portal';
import {NewsPopoverComponent} from './news-popover/news-popover.component';
import {NewsService} from '../../services/news/news.service';
import {DialogData} from '../../models/dialog-data.model';

@Component({
  selector: 'app-subject-news',
  templateUrl: './subject-news.component.html',
  styleUrls: ['./subject-news.component.less']
})
export class SubjectNewsComponent implements OnInit {

  private teacher: boolean = false;

  private subjectId: string;

  public news: News[];
  public selectNews: News = null;
  private unsubscription$: Subject<any> = new Subject();

  @ViewChildren("popoverContent")
  private popoverContent: ElementRef<any>;

  constructor(private newsService: NewsService,
              public dialog: MatDialog,
              private store: Store<IAppState>) {
  }

  ngOnInit() {
    this.store.pipe(select(getUser)).subscribe(user => {
      if (user && user.role.toLowerCase() === 'lector') {
        this.teacher = true;
      }
    });
    this.store.pipe(select(getSubjectId)).subscribe(subjectId => this.subjectId = subjectId);

    // TODO: Load in all date
    this.newsService.loadData();
    this.refreshDate();
  }

  refreshDate() {
    this.newsService.getAllNews()
      .pipe(
        takeUntil(this.unsubscription$)
      )
      .subscribe(
        (news: News[]) => {
          console.log(news)
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
    const nowDate =  new Date().toISOString().split('T')[0].split('-').reverse().join('.');
    const newNews = {
      id: news ? news.id : '0',
      subjectId: this.subjectId,
      title: news ? news.title : '',
      body: news ? news.body : '',
      disabled: news ? news.disabled : false,
      isOldDate: false,
      dateCreate: news ? news.dateCreate: nowDate
    };
    const dialogData: DialogData = {
      title: news? 'Редактирование новости' : 'Добавление новости',
      buttonText: 'Сохранить',
      model: newNews
    };
    const dialogRef = this.openDialog(dialogData, NewsPopoverComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        news? this.newsService.updateNews(result): this.newsService.createNews(result);
      }
    });
  }

  deleteNews(news: News) {
    const dialogData: DialogData = {
      title: 'Удаление новости',
      body: 'новость "' + news.title + '"' ,
      buttonText: 'Удалить',
      model: news.id
    };
    const dialogRef = this.openDialog(dialogData, DeletePopoverComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
      if (result) {
        this.newsService.deleteNews(news.id, this.subjectId)
      }
    });
  }

  openDialog(data: DialogData, popover: ComponentType<any>): MatDialogRef<any> {
    return this.dialog.open(popover, {data});
  }

}
