import {Component, ElementRef, OnInit, ViewChildren} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NewsService} from '../../services/news.service';
import {News} from '../../models/news.model';
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {DialogData, PopoverComponent} from "../../shared/popover/popover.component";
import {IAppState} from "../../store/state/app.state";
import {Store, select} from '@ngrx/store';
import {getSubjectId} from "../../store/selectors/subject.selector";
import {getNews} from "../../store/selectors/news.selectors";
import {GetNews} from "../../store/actions/news.actions";

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

  @ViewChildren("popoverContent")
  private popoverContent: ElementRef<any>;

  constructor(private newsService: NewsService,
              public dialog: MatDialog,
              private store: Store<IAppState>,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.teacher = true;
    this.store.pipe(select(getSubjectId)).subscribe(subjectId => this.subjectId = subjectId);
    this.load();
  }

  disableNews() {
    console.log(this.subjectId)
    this.newsService.disableNews(this.subjectId).subscribe(response => {
      this.load();
    })
  }

  enableNews() {
    this.newsService.enableNews(this.subjectId).subscribe(response => {
      this.load();
    })
  }

  load() {
    this.store.dispatch(new GetNews());
    this.store.pipe(select(getNews)).subscribe(news => {
      this.news = news;
    });
  }

  constructorNews(news?: News) {
    const newNews = {
      id: news? news.id: '0',
      subjectId: this.subjectId,
      title: news? news.title: '',
      body: news? news.body: '',
      disabled: news? news.disabled: false,
      isOldDate: false,
    };
    const dialogData: DialogData = {
      title: 'Добавление новости',
      body: '',
      buttonText: 'Сохранить',
      model: newNews
    };
    const dialogRef = this.openDialog(dialogData);

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result) {
        this.newsService.saveNews(result).subscribe(response => {
          console.log(response.Message);
          this.load();
        })
      }
    });
  }

  deleteNews(news: News) {
    const dialogData: DialogData = {
      title: 'Удаление новости',
      body: '<p>Вы действительно хотите удалить новость?</p>',
      buttonText: 'Удалить',
    };
    const dialogRef = this.openDialog(dialogData);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.newsService.deleteNews(news.id, this.subjectId).subscribe(response => {
          console.log(response.Message);
          this.load();
        })
      }
    });
  }

  openDialog(data: DialogData): MatDialogRef<any> {
    return this.dialog.open(PopoverComponent, {data});
  }

}
