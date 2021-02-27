import {Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {TestPassingService} from "../../../../service/test-passing.service";
import {UserAnswers} from "../../../../models/user-answers.model";
import {AutoUnsubscribe} from "../../../../decorator/auto-unsubscribe";
import {AutoUnsubscribeBase} from "../../../../core/auto-unsubscribe-base";
import {Subject} from "rxjs";
import {takeUntil, tap} from "rxjs/operators";


@AutoUnsubscribe
@Component({
  selector: "app-answers-popup",
  templateUrl: "./answers-popup.component.html",
  styleUrls: ["./answers-popup.component.less"]
})
export class AnswersPopupComponent extends AutoUnsubscribeBase implements OnInit {

  public answers: UserAnswers[];
  private unsubscribeStream$: Subject<void> = new Subject<void>();
  public mark: any;
  public percent: any;

  constructor(public dialogRef: MatDialogRef<AnswersPopupComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private testPassingService: TestPassingService) {
    super();
  }

  ngOnInit() {
    this.testPassingService.getAnswersByStudentAndTest(this.data.id, this.data.event)
      .pipe(
        tap((answers) => {
          this.answers = answers;
          let correct: number = 0;
          answers.forEach(answer => {
            if(answer.Points){
              correct += 1
            }
          });
          const marks: number = correct / answers?.length;
          this.mark = Math.round(marks * 10);
          this.percent = Math.round(marks * 100);
        }),
        takeUntil(this.unsubscribeStream$))
      .subscribe();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
