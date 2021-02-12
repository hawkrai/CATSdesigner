import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {NewsService} from '../../service/news.service';
import {LessonService} from '../../service/lesson.service';

@Component({
  selector: 'app-all-news',
  templateUrl: './all-news.component.html',
  styleUrls: ['./all-news.component.css']
})
export class AllNewsComponent implements OnInit {

  username: any;
  news: any;
  subjects: any[] = [];
  subject: any;

  constructor(public dialogRef: MatDialogRef<AllNewsComponent>,
              @Inject(MAT_DIALOG_DATA) private data: any, private newsService: NewsService,
              private lessonservice: LessonService) { }


  ngOnInit() {
    this.username = this.data.user.user.username;
    this.lessonservice.getAllSubjects(this.username).subscribe(subjects => {
      this.subjects = subjects;
      this.newsService.getAllNews(this.username).subscribe(news => {
        this.news = news;
      });
    });
  }

}
