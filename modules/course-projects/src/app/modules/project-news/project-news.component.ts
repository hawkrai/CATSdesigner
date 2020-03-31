import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NewsService} from '../../services/news.service';
import {News} from '../../models/news.model';

@Component({
  selector: 'app-subject-news',
  templateUrl: './project-news.component.html',
  styleUrls: ['./project-news.component.less']
})
export class ProjectNewsComponent implements OnInit {

  private subjectId: string;

  public news: News[];

  constructor(private newsService: NewsService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.subjectId = this.route.snapshot.params.subjectId;

    this.newsService.getAllNews(this.subjectId).subscribe(res => {
        this.news = res.filter(news => !news.Disabled);
      });
  }

}
