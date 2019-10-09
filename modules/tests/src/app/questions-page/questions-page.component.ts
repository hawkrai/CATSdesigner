import {Component, OnInit} from '@angular/core';
import {TestService} from "../service/test.service";
import {Question} from "../models/question/question.model";
import {ActivatedRoute} from "@angular/router";
import {TestAvailable} from "../models/test-available.model";
import {MatDialog} from "@angular/material";
import {QuestionPopupComponent} from "./components/question-popup/question-popup.component";


@Component({
  selector: 'app-questions-page',
  templateUrl: './questions-page.component.html',
  styleUrls: ['./questions-page.component.less']
})
export class QuestionsPageComponent implements OnInit {

  public questions: Question[];
  public questionsDefault: Question[];
  public test: TestAvailable;

  constructor(private testService: TestService,
              private route: ActivatedRoute,
              public dialog: MatDialog) {
  }

  ngOnInit() {
    const testId = this.route.snapshot.paramMap.get('id');
    this.testService.getTestTestById(testId).subscribe((test) => {
      this.test = test;
    });
    this.testService.getQuestionsByTest(testId).subscribe((questions) => {
      this.questions = questions;
      this.questionsDefault = questions;
    });
  }

  public deleteQuestion(event): void {
    this.testService.deleteQuestion(event).subscribe();
  }

  public openPopup(event): void {
    const title = this.test.Title;
    const dialogRef = this.dialog.open(QuestionPopupComponent, {
      width: '700px',
      data: {event, title}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }

  public filterQuestions(event): void {
    this.questions = (JSON.parse(JSON.stringify(this.questionsDefault)));
    this.questions = this.questions.filter(question => question.Title.includes(event));
  }
}
