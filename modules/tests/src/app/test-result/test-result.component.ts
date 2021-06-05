import {Component, OnInit} from "@angular/core";
import {TestPassingService} from "../service/test-passing.service";
import {ActivatedRoute, Router} from "@angular/router";
import {UserAnswers} from "../models/user-answers.model";
import {takeUntil} from "rxjs/operators";
import {AutoUnsubscribe} from "../decorator/auto-unsubscribe";
import {AutoUnsubscribeBase} from "../core/auto-unsubscribe-base";
import {Subject} from "rxjs";
import moment from "moment";
import {ClosedTestResult} from "../models/closed-test-result.model";
import {DataValues} from "../models/data-values.model";
import {Constants} from "../models/constanst/DataConstants";


@AutoUnsubscribe
@Component({
  selector: "app-test-result",
  templateUrl: "./test-result.component.html",
  styleUrls: ["./test-result.component.less"]
})
export class TestResultComponent extends AutoUnsubscribeBase implements OnInit {

  public result: UserAnswers[];
  public testName: string;
  public testId: string;
  public mark: number = 0;
  public endTime: string;
  public startTime: string;
  public percent: number;
  public endDate: string;
  private unsubscribeStream$: Subject<void> = new Subject<void>();

  constructor(private testPassingService: TestPassingService,
              private router: Router,
              private route: ActivatedRoute) {
    super();
  }

  ngOnInit() {
    this.testId = this.route.snapshot.queryParamMap.get("testId");
    this.testPassingService.CloseTestAndGetResult(this.testId)
      .pipe(takeUntil(this.unsubscribeStream$))
      .subscribe((result: ClosedTestResult) => {
        this.result = result.Data.find((res: DataValues) => res.Key === Constants.ANSWERS).Value;
        this.testName = result.Data.find((res: DataValues) => res.Key === Constants.TEST_NAME).Value;
        this.mark = result.Data.find((res: DataValues) => res.Key === Constants.MARK).Value;
        this.percent = result.Data.find((res: DataValues) => res.Key === Constants.PERCENT).Value;
        this.startTime = moment(result.Data.find((res: DataValues) => res.Key === Constants.START_TIME).Value).format("HH:mm:ss");
        this.endTime = moment(result.Data.find((res: DataValues) => res.Key === Constants.END_TIME).Value).format("HH:mm:ss");
        this.endDate = moment(result.Data.find((res: DataValues) => res.Key === Constants.END_TIME).Value).format("DD.MM.YYYY");
      });

  }

  public navigate(): void {
    this.router.navigate(["/test-control"]);
  }
}
