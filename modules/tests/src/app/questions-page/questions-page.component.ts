import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {TestService} from "../service/test.service";
import {Question} from "../models/question/question.model";
import {ActivatedRoute} from "@angular/router";
import {MatDialog} from "@angular/material";
import {QuestionPopupComponent} from "./components/question-popup/question-popup.component";
import {Test} from "../models/test.model";
import {QuestionOtherTestComponent} from "./components/question-other-test/question-other-test.component";


@Component({
  selector: 'app-questions-page',
  templateUrl: './questions-page.component.html',
  styleUrls: ['./questions-page.component.less']
})
export class QuestionsPageComponent implements OnInit {

  public questions: Question[];
  public questionsDefault: Question[];
  public test: Test;
  public testId: string;

  constructor(private testService: TestService,
              private route: ActivatedRoute,
              private cdr: ChangeDetectorRef,
              public dialog: MatDialog) {
  }

  ngOnInit() {
    this.testId = this.route.snapshot.paramMap.get('id');
    this.testService.getTestTestById(this.testId).subscribe((test) => {
      this.test = test;
    });
    this.loadQuestions();
  }

  public loadQuestions(): void {
    this.testService.getQuestionsByTest(this.testId).subscribe((questions) => {
      this.questions = questions;
      this.questionsDefault = questions;
    });
  }

  public deleteQuestion(event): void {
    this.testService.deleteQuestion(event).subscribe();
    this.loadQuestions();
    this.cdr.detectChanges();
  }

  public openPopup(event): void {
    const title = this.test.Title;
    const dialogRef = this.dialog.open(QuestionPopupComponent, {
      width: '700px',
      data: {event, title, test: this.testId},
      autoFocus: false,
      maxHeight: '90vh'
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.loadQuestions();
      }
    });
  }

  public addQuestionFromOtherTest(event): void {
    const dialogRef = this.dialog.open(QuestionOtherTestComponent, {
      width: '700px',
      data: {event, test: this.testId},
      autoFocus: false,
      maxHeight: '90vh'
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.loadQuestions();
      }
    });
  }

  public filterQuestions(event): void {
    this.questions = (JSON.parse(JSON.stringify(this.questionsDefault)));
    this.questions = this.questions.filter(question => question.Title.includes(event));
  }

  public addNewQuestion(): void {
    this.openPopup(null);
  }
}
