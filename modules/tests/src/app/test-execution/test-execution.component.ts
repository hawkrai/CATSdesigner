import {Component, OnInit} from '@angular/core';
import {TestPassingService} from '../service/test-passing.service';
import {TestQuestion} from '../models/question/test-question.model';
import {ActivatedRoute, Router} from "@angular/router";
import {TestService} from "../service/test.service";
import {Test} from "../models/test.model";
import {map, take, takeUntil} from "rxjs/operators";
import {Observable, Subject, timer} from "rxjs";
import {AutoUnsubscribe} from "../decorator/auto-unsubscribe";
import {AutoUnsubscribeBase} from "../core/auto-unsubscribe-base";

@AutoUnsubscribe
@Component({
  selector: 'app-test-execution',
  templateUrl: './test-execution.component.html',
  styleUrls: ['./test-execution.component.css']
})
export class TestExecutionComponent extends AutoUnsubscribeBase implements OnInit {
  public question: TestQuestion;
  public questionNumber: string;
  public testId: string;
  public test: Test;
  public questionArray: number[];
  public result: any;
  public counter$: Observable<string>;
  public count = 60;
  private unsubscribeStream$: Subject<void> = new Subject<void>();

  constructor(private testPassingService: TestPassingService,
              private testService: TestService,
              private route: ActivatedRoute,
              private router: Router) {
    super();
  }

  ngOnInit() {
    this.testId = this.route.snapshot.paramMap.get('id');
    this.questionNumber = '1';
    this.testService.getTestById(this.testId)
      .pipe(takeUntil(this.unsubscribeStream$))
      .subscribe((test) => {
      this.test = test;
      this.fillQuestionArray();
      console.log("this.test", this.test);
    });
    this.testPassingService.getNextQuestion(this.testId, this.questionNumber)
      .pipe(takeUntil(this.unsubscribeStream$))
      .subscribe((question: TestQuestion) => {
      this.question = question;
      this.counter$ = timer(0, 1000).pipe(
        take(this.question.Seconds),
        map(() => {
          if (this.question.Seconds) {
            --this.question.Seconds;
            const hour: number = Math.floor(this.count / 3600);
            let restTime: number = this.question.Seconds - 3600 * hour;
            const minute: number = Math.floor(restTime / 60);
            restTime = restTime - 60 * minute;

            return (hour >= 10 ? hour.toString() : "0" + hour.toString()) + ":" + (minute >= 10 ? minute.toString() : "0" + minute.toString()) + ":" + (restTime >= 10 ? restTime.toString() : "0" + restTime.toString());
          }
          else {
            this.router.navigate(['page']);
          }
        })
      );
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
        this.testPassingService.getNextQuestion(this.testId, this.questionNumber)
          .pipe(takeUntil(this.unsubscribeStream$))
          .subscribe((question: TestQuestion) => {
          if (question && question.Question) {
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
