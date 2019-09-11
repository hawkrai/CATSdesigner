import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { NewsService } from '../../services/news.service';
import {News} from '../../models/news.model';
import {ConverterService} from '../../services/converter.service';

@Component({
  selector: 'app-subject-news',
  templateUrl: './subject-news.component.html',
  styleUrls: ['./subject-news.component.less']
})
export class SubjectNewsComponent implements OnInit {

  private subjectId: string;

  public news: News[];

  constructor(private newsService: NewsService,
              private route: ActivatedRoute,
              private converter: ConverterService) { }

  ngOnInit() {
    this.subjectId = this.route.snapshot.params.subjectId;

    this.newsService.getAllNews(this.subjectId).subscribe(res => {
        this.news = this.converter.newsModelsConverter(res.News);
        console.log(this.news);
        this.news = this.news.filter((news: News) => this.checkSemester(news.dateCreate));
        console.log(this.news);
      });
  }

  checkSemester(dateCreate: string) {
    const monthCreate = Number(dateCreate.slice(3, 5));
    const yearCreate = Number(dateCreate.slice(-4));
    const nowDate = new Date();
    if (nowDate.getMonth() > 1 && nowDate.getMonth() < 9) {
      return (monthCreate > 1 && monthCreate < 9 && yearCreate === nowDate.getFullYear());
    } else {
      return ((monthCreate > 8 || monthCreate === 1) && yearCreate === nowDate.getFullYear());
    }
  }

}
