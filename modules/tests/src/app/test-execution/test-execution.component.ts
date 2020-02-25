import {Component, OnInit} from '@angular/core';
import {TestPassingService} from '../service/test-passing.service';
import {TestQuestion} from '../models/question/test-question.model';
import {ActivatedRoute, Router} from "@angular/router";
import {TestService} from "../service/test.service";
import {Test} from "../models/test.model";


@Component({
  selector: 'app-test-execution',
  templateUrl: './test-execution.component.html',
  styleUrls: ['./test-execution.component.css']
})
export class TestExecutionComponent implements OnInit {
  public question: TestQuestion;
  public questionNumber: string;
  public testId: string;
  public test: Test;
  public questionArray: number[];
  public result: any;

  constructor(private testPassingService: TestPassingService,
              private testService: TestService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    this.testId = this.route.snapshot.paramMap.get('id');
    this.questionNumber = '1';
    this.testService.getTestTestById(this.testId).subscribe((test) => {
      this.test = test;
      this.fillQuestionArray();
      console.log("this.test", this.test);
    });
    this.testPassingService.getNextQuestion(this.testId, this.questionNumber).subscribe((question: TestQuestion) => {
      this.question = question;
    });
  }

  public nextQuestion(answered: boolean, questionNumber?): void {
    if (this.questionArray.length !== 0) {
      if (questionNumber && !this.questionArray.includes(questionNumber)) {
        return;
      }
      if (answered) {
        const index = this.questionArray.indexOf(Number(this.questionNumber));
        this.questionArray.splice(index, 1);
      }
      if (this.questionArray.length !== 0) {
        if (questionNumber && this.questionArray.includes(questionNumber)) {
          this.questionNumber = questionNumber;
        } else if (questionNumber && !this.questionArray.includes(questionNumber)) {
          this.questionNumber = this.questionArray[0].toString();
        } else if (this.questionArray.includes(Number(this.questionNumber) + 1)) {
          this.questionNumber = (Number(this.questionNumber) + 1).toString();
        } else {
          const nextQuestion = this.questionArray.find(value => value > Number(this.questionNumber));
          if (nextQuestion) {
            this.questionNumber = nextQuestion.toString();
          } else {
            this.questionNumber = this.questionArray[0].toString();
          }
        }
        this.testPassingService.getNextQuestion(this.testId, this.questionNumber).subscribe((question: TestQuestion) => {
          if (question && this.question.Question) {
            this.question = question;
          } else {
            this.router.navigate(['/test-result'], {queryParams: {testId: this.test.Id}});
          }
        });
      } else {
        this.router.navigate(['/test-result'], {queryParams: {testId: this.test.Id}});
      }
    } else {
      this.router.navigate(['/test-result'], {queryParams: {testId: this.test.Id}});
    }
  }

  private fillQuestionArray(): void {
    this.questionArray = Array.from(Array(this.test.CountOfQuestions), (x, index) => index + 1);
    console.log("this.questionArray", this.questionArray);
  }
}
