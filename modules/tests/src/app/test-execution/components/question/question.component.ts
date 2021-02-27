import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {TestQuestion} from "../../../models/question/test-question.model";
import {Answer} from "../../../models/question/answer.model";
import {TestPassingService} from "../../../service/test-passing.service";
import {Test} from "../../../models/test.model";
import {catchError, takeUntil, tap} from "rxjs/operators";
import {of, Subject} from "rxjs";
import {Router} from "@angular/router";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {AutoUnsubscribe} from "../../../decorator/auto-unsubscribe";
import {AutoUnsubscribeBase} from "../../../core/auto-unsubscribe-base";
import {MatSnackBar} from "@angular/material";
import {TranslatePipe} from "../../../../../../../container/src/app/pipe/translate.pipe";


@AutoUnsubscribe
@Component({
  selector: "app-question",
  templateUrl: "./question.component.html",
  styleUrls: ["./question.component.less"]
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
  @Output()
  public goToNextQuestion: EventEmitter<any> = new EventEmitter();
  private unsubscribeStream$: Subject<void> = new Subject<void>();
  private value: string;
  private isTrue: boolean;
  private answers: number = 0;

  constructor(private testPassingService: TestPassingService,
              private snackBar: MatSnackBar,
              private translatePipe: TranslatePipe,
              private router: Router) {
    super();
  }

  ngOnInit() {
    console.log(this.question);
  }

  public answerQuestion(): void {
    if (this.question.Question.QuestionType === 3 || this.charsNeskolko[0] || this.charsNeskolko[1] ||
      this.charsNeskolko[2] || this.charsNeskolko[3] || this.charsNeskolko[4] || this.charsNeskolko[5] ||
      this.charsNeskolko[6] || this.charsNeskolko[7] || this.charsNeskolko[8] || this.chosenAnswer || this.value) {
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
      if (this.test.ForSelfStudy) {
        this.isTrue = this.checkSelfStudyAnswer(request);
      }
      this.chosenAnswer = null;
      this.testPassingService.answerQuestionAndGetNext(request)
        .pipe(
          tap(() => {
            this.getOnNextQuestion(true, this.isTrue);
            this.value = null;
          }),
          takeUntil(this.unsubscribeStream$),
          catchError(() => {
            this.router.navigate(["/test-result"], {queryParams: {testId: this.test.Id}});
            return of(null);
          })
        )
        .subscribe();
    } else {
      this.openSnackBar(this.translatePipe.transform("text.test.choose.variant", "Выберите вариант ответа"));
    }
  }

  public openSnackBar(message: string, action?: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
      panelClass: "red-snack"
    });
  }

  public getOnNextQuestion(answered: boolean, isTrue = true): void {
    this.charsNeskolko = {};
    this.goToNextQuestion.emit({answered, isTrue});
  }

  public onValueChange(event): void {
    this.value = event.currentTarget.value;
    console.log(event);
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.question.Question.Answers, event.previousIndex, event.currentIndex);
  }

  private checkSelfStudyAnswer(request): boolean {
    this.answers = 0;
    const answersLength: number = request.answers.length;
    request.answers.forEach((answer) => {
      this.question.Question.Answers.forEach((questionAnswer) => {
        if (answer.Id === questionAnswer.Id.toString() && answer.IsCorrect === questionAnswer.СorrectnessIndicator) {
          this.answers++;
        }
      });
    });
    return this.answers === answersLength;
  }
}
