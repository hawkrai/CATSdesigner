import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { TestService } from "../../../service/test.service";
import { Test } from "../../../models/test.model";
import { Question } from "../../../models/question/question.model";
import { map, startWith, takeUntil, tap } from "rxjs/operators";
import { AutoUnsubscribe } from "../../../decorator/auto-unsubscribe";
import { AutoUnsubscribeBase } from "../../../core/auto-unsubscribe-base";
import { Observable, Subject } from "rxjs";
import { FormControl } from "@angular/forms";


@AutoUnsubscribe
@Component({
  selector: "app-question-other-test",
  templateUrl: "./question-other-test.component.html",
  styleUrls: ["./question-other-test.component.less"]
})
export class QuestionOtherTestComponent extends AutoUnsubscribeBase implements OnInit {
  public tests: Test[];
  public testId: number | string;
  public questions: Question[];
  public filteredQuestions: Question[];
  public chosenQuestions: { [key: string]: string } = {};
  public request: Question = new Question();
  myControl = new FormControl();
  filteredOptions: Observable<Test[]>;
  private unsubscribeStream$: Subject<void> = new Subject<void>();

  constructor(public dialogRef: MatDialogRef<QuestionOtherTestComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private testService: TestService) {
    super();
  }

  ngOnInit() {
    this.testService.getTestForLector()
      .pipe(
        tap((tests: Test[]) => {
          tests.forEach((test) => {
            let sliced = test.Title.slice(0, 80);
            if (sliced.length < test.Title.length) {
              sliced += "...";
            }
            test.tooltipTitle = sliced;
          });
          this.tests = tests.sort((n1, n2) => n1.Id - n2.Id);
        }),
        takeUntil(this.unsubscribeStream$))
      .subscribe();
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(""),
        map(value => typeof value === "string" ? value : value.Title),
        map(name => {
          if (name) {
            console.log(this._filter(name));
            return this._filter(name);
          } else {
            return this.tests.slice();
          }
        }
        ));
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    this.request.testId = <string>this.data.test;
    this.request.questionItems = [];
    Object.keys(this.chosenQuestions).forEach(value => {
      if (this.chosenQuestions[value])
        this.request.questionItems.push(Number(value));
    });
    this.testService.AddQuestionsFromAnotherTest(this.request)
      .pipe(
        tap(() => this.dialogRef.close(true)),
        takeUntil(this.unsubscribeStream$)
      ).subscribe();
  }

  public onValueChange(event): void {
    this.testService.getQuestionsFromOtherTest(event.option.value.Id)
      .pipe(takeUntil(this.unsubscribeStream$))
      .subscribe(questions => {
        questions.forEach((question) => {
          let sliced = question.Title.slice(0, 80);
          if (sliced.length < question.Title.length) {
            sliced += "...";
          }
          question.tooltipTitle = sliced;
        });

        this.questions = questions;
        this.filteredQuestions = questions;
        this.filteredQuestions.sort((a, b) => a.tooltipTitle.toLocaleLowerCase().charCodeAt(0) - b.tooltipTitle.toLocaleLowerCase()[0].charCodeAt(0));
      });
  }

  public filterQuestions(event): void {
    this.filteredQuestions = this.questions.filter((question) => question.Title.toLowerCase().includes(event.target.value.toLowerCase()));
    this.filteredQuestions.sort((a, b) => a.tooltipTitle.toLocaleLowerCase().charCodeAt(0) - b.tooltipTitle.toLocaleLowerCase()[0].charCodeAt(0));
  }

  displayFn(user: Test): string {
    return user && user.Title ? user.Title : "";
  }

  private _filter(name: string): Test[] {
    const filterValue = name.toLowerCase();

    return this.tests.filter(option => option.Title.toLowerCase().indexOf(filterValue) === 0);
  }
}
