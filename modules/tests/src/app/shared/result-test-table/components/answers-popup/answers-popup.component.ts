import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {TestPassingService} from "../../../../service/test-passing.service";
import {UserAnswers} from "../../../../models/user-answers.model";
import {AutoUnsubscribe} from "../../../../decorator/auto-unsubscribe";
import {AutoUnsubscribeBase} from "../../../../core/auto-unsubscribe-base";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";


@AutoUnsubscribe
@Component({
  selector: 'app-answers-popup',
  templateUrl: './answers-popup.component.html',
  styleUrls: ['./answers-popup.component.less']
})
export class AnswersPopupComponent extends AutoUnsubscribeBase implements OnInit {

  public answers: UserAnswers[];
  private unsubscribeStream$: Subject<void> = new Subject<void>();

  constructor(public dialogRef: MatDialogRef<AnswersPopupComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private testPassingService: TestPassingService) {
    super();
  }

  ngOnInit() {
    this.testPassingService.getAnswersByStudentAndTest(this.data.id, this.data.event)
      .pipe(takeUntil(this.unsubscribeStream$))
      .subscribe((answers) => {
        this.answers = answers;
      })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
