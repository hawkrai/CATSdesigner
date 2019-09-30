import {Component, OnInit} from '@angular/core';
import {TestService} from "../service/test.service";
import {Question} from "../models/question/question.model";
import {ActivatedRoute} from "@angular/router";


@Component({
  selector: 'app-questions-page',
  templateUrl: './questions-page.component.html',
  styleUrls: ['./questions-page.component.css']
})
export class QuestionsPageComponent implements OnInit {

  public questions: Question[];

  constructor(private testService: TestService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    const testId = this.route.snapshot.paramMap.get('id');
    this.testService.getQuestionsByTest(testId).subscribe((questions) => {
      this.questions = questions;
    });
  }

}
