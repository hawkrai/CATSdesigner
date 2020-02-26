import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TestQuestion} from '../../../models/question/test-question.model';
import {Answer} from '../../../models/question/answer.model';
import {TestPassingService} from '../../../service/test-passing.service';
import {Test} from "../../../models/test.model";
import {catchError, tap} from "rxjs/operators";
import {of} from "rxjs";
import {Router} from "@angular/router";


@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.less']
})
export class QuestionComponent implements OnInit {

  @Input()
  public question: TestQuestion;

  @Input()
  public questionNumber: string;

  @Input()
  public test: Test;

  public chosenAnswer: Answer;
  public charsNeskolko: { [key: string]: any } = {};

  @Output()
  public goToNextQuestion: EventEmitter<boolean> = new EventEmitter();

  constructor(private testPassingService: TestPassingService,
              private router: Router) {
  }

  ngOnInit() {
    console.log(this.question);
    if (this.question.Question.QuestionType === 0) {

    }
  }

  public answerQuestion(): void {
    //todo hardcode
    console.log(this.chosenAnswer);
    const request = {
      answers: [],
      questionNumber: this.question.Number,
      testId: this.test.Id,
      userId: 10031
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
        if (this.question.Question.Answers.length === index + 1) {
          request.answers.push({Id: answer.Id.toString(), IsCorrect: 1});
        }
        else {
          request.answers.push({Id: answer.Id.toString(), IsCorrect: 0});
        }
      });

    } else if (this.question.Question.QuestionType === 2) {

    } else if (this.question.Question.QuestionType === 3) {

    }

    this.testPassingService.answerQuestionAndGetNext(request)
      .pipe(
        tap(() => this.getOnNextQuestion(true)),
        catchError(() => {
          this.router.navigate(['/test-result'], {queryParams: {testId: this.test.Id}});
          return of(null);
        })
      )
      .subscribe();
  }

  public getOnNextQuestion(answered: boolean): void {
    this.goToNextQuestion.emit(answered);
  }

  public onValueChange(event): void {
    console.log(event);
  }
}
