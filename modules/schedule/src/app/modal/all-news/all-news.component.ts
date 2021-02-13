import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {NewsService} from '../../service/news.service';
import {Message} from '../../../../../../container/src/app/core/models/message';

@Component({
  selector: 'app-all-news',
  templateUrl: './all-news.component.html',
  styleUrls: ['./all-news.component.css']
})
export class AllNewsComponent implements OnInit {

  username: any;
  news: any;
  subject: any;
  user: any;

  constructor(public dialogRef: MatDialogRef<AllNewsComponent>,
              @Inject(MAT_DIALOG_DATA) private data: any, private newsService: NewsService) { }


  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    this.newsService.getAllNews(this.user.username).subscribe(news => {
      this.news = news;
    });
  }

  public rerouteToSubject() {
    const message: Message = new Message();
    message.Value = '/Subject?subjectId=' + this.data.itemNews.SubjectId;
    message.Type = 'Route';
    this.sendMessage(message);
  }

  public sendMessage(message: Message): void {
    window.parent.postMessage([{channel: message.Type, value: message.Value}], '*');
  }
}
