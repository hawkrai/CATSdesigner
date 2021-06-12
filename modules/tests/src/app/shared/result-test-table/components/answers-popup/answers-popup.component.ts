import {Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {TestPassingService} from "../../../../service/test-passing.service";
import {UserAnswers} from "../../../../models/user-answers.model";
import {AutoUnsubscribe} from "../../../../decorator/auto-unsubscribe";
import {AutoUnsubscribeBase} from "../../../../core/auto-unsubscribe-base";
import {Subject} from "rxjs";
import {takeUntil, tap} from "rxjs/operators";
import {DataValues} from "../../../../models/data-values.model";
import {Constants} from "../../../../models/constanst/DataConstants";
import moment from "moment";

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
  public startTime: string;
  public startDate: string;

  constructor(public dialogRef: MatDialogRef<AnswersPopupComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private testPassingService: TestPassingService) {
    super();
  }

  ngOnInit() {
    this.testPassingService.getAnswersByStudentAndTest(this.data.id, this.data.event)
      .pipe(
        tap((answers: DataValues[]) => {
          this.answers = answers.find((res: DataValues) => res.Key === Constants.USER_ANSWERS).Value;
          this.mark = answers.find((res: DataValues) => res.Key === Constants.TEST_INFO).Value.Points;
          this.percent = answers.find((res: DataValues) => res.Key === Constants.TEST_INFO).Value.Percent;
          this.startTime = moment(answers.find((res: DataValues) => res.Key === Constants.TEST_INFO).Value.StartTime).format("HH:mm:ss");
          this.startDate = moment(answers.find((res: DataValues) => res.Key === Constants.TEST_INFO).Value.StartTime).format("DD.MM.YYYY");
        }),
        takeUntil(this.unsubscribeStream$))
      .subscribe();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
