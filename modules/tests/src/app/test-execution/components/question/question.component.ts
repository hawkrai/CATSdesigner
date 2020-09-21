import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TestQuestion} from '../../../models/question/test-question.model';
import {Answer} from '../../../models/question/answer.model';
import {TestPassingService} from '../../../service/test-passing.service';
import {Test} from "../../../models/test.model";
import {catchError, takeUntil, tap} from "rxjs/operators";
import {of, Subject} from "rxjs";
import {Router} from "@angular/router";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {AutoUnsubscribe} from "../../../decorator/auto-unsubscribe";
import {AutoUnsubscribeBase} from "../../../core/auto-unsubscribe-base";


@AutoUnsubscribe
@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.less']
})
export class QuestionComponent extends AutoUnsubscribeBase implements OnInit {

  @Input()
  public question: TestQuestion;

  @Input()
  public questionNumber: string;

  @Input()
  public test: Test;

  public chosenAnswer: Answer;
  public charsNeskolko: { [key: string]: any } = {};
  public charsNew: { [key: string]: any } = {};
  public charsSequence: { [key: string]: any } = {};
  private unsubscribeStream$: Subject<void> = new Subject<void>();

  @Output()
  public goToNextQuestion: EventEmitter<boolean> = new EventEmitter();
  private value: string;

  constructor(private testPassingService: TestPassingService,
              private router: Router) {
    super();
  }

  ngOnInit() {
    console.log(this.question);
  }

  public answerQuestion(): void {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    console.log(this.chosenAnswer);
    const request = {
      answers: [],
      questionNumber: this.question.Number,
      testId: this.test.Id,
      userId: user.id
    };
    if (this.question.Question.QuestionType === 0) {
      this.question.Question.Answers.forEach((answer) => {
        if (answer.Id === this.chosenAnswer.Id) {
          request.answers.push({Id: answer.Id.toString(), IsCorrect: 1});
        }
        else {
          request.answers.push({Id: answer.Id.toString(), IsCorrect: 0});
        }
      });
    } else if (this.question.Question.QuestionType === 1) {
      this.question.Question.Answers.forEach((answer, index) => {
        request.answers.push({Id: answer.Id.toString(), IsCorrect: this.charsNeskolko[index] ? 1 : 0});
      });

    } else if (this.question.Question.QuestionType === 2) {
      request.answers.push({Content: this.value, IsCorrect: 0});

    } else if (this.question.Question.QuestionType === 3) {
      this.question.Question.Answers.forEach((answer, index) => {
        request.answers.push({Id: answer.Id.toString(), IsCorrect: index});
      });
    }

    this.testPassingService.answerQuestionAndGetNext(request)
      .pipe(
        tap(() => this.getOnNextQuestion(true)),
        takeUntil(this.unsubscribeStream$),
        catchError(() => {
          this.router.navigate(['/test-result'], {queryParams: {testId: this.test.Id}});
          return of(null);
        })
      )
      .subscribe();
  }

  public getOnNextQuestion(answered: boolean): void {
    this.charsNeskolko = {};
    this.goToNextQuestion.emit(answered);
  }

  public onValueChange(event): void {
    this.value = event.currentTarget.value;
    console.log(event);
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.question.Question.Answers, event.previousIndex, event.currentIndex);
  }
}
