import {Component, OnInit} from '@angular/core';
import {NewsService} from '../service/news.service';
import {LessonService} from '../service/lesson.service';
import {MatDialog} from '@angular/material/dialog';
import {NewsInfoComponent} from '../modal/news-info/news-info.component';
import {Message} from '../../../../../container/src/app/core/models/message';
import {ModuleCommunicationService} from 'test-mipe-bntu-schedule';
import {AllNewsComponent} from '../modal/all-news/all-news.component';
import {ScheduleMainComponent} from '../schedule-main/schedule-main.component';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {

  user: any;
  news: any;
  isEnableNews = true;
  toolTip = 'Скрыть новости';

  constructor(private newsService: NewsService,
              private lessonservice: LessonService,
              private modulecommunicationservice: ModuleCommunicationService,
              private dialog: MatDialog,
              private schedule: ScheduleMainComponent) {
  }


  ngOnInit() {
    // localStorage.setItem('currentUser', JSON.stringify({id: 10031, role: 'lector', userName: 'popova'}));
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    this.newsService.getAllNews(this.user.userName).subscribe(news => {
      this.news = news;
      if (this.news.length > 12) {
        this.news = this.news.slice(1, 13);
      }
      if (news !== null && news !== undefined) {
        if (news.length === 0) {
          this.isEnableNews = false;
        }
      } else {
        this.isEnableNews = false;
      }
      console.log(this.news);
    });
  }

  public openItemInfo(item: any) {
    const dialogRef = this.dialog.open(NewsInfoComponent, {
      width: '800px',
      position: {top: '10%'}, data: {itemNews: item}
    });
  }

  public rerouteToSubject(item: any) {
    const message: Message = new Message();
    message.Value = '/Subject?subjectId=' + item.SubjectId;
    message.Type = 'Route';
    this.modulecommunicationservice.sendMessage(window.parent, message);
  }

  public calcColor(subject: any): any {
    if (subject != null) {
      return '3px solid ' + subject.Color;
    }
  }

  public openAllNews() {
    const dialogRef = this.dialog.open(AllNewsComponent, {
      width: '800px', height: '550px',
      position: {top: '0%'}, data: {news: this.news}
    });
  }

  public hideNews() {
    this.schedule.hideNews();
  }

}
