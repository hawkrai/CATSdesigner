import {Component, OnInit} from "@angular/core";
import {TestPassingService} from "../service/test-passing.service";
import {ActivatedRoute, Router} from "@angular/router";
import {UserAnswers} from "../models/user-answers.model";
import {TestService} from "../service/test.service";
import {Test} from "../models/test.model";
import {takeUntil} from "rxjs/operators";
import {AutoUnsubscribe} from "../decorator/auto-unsubscribe";
import {AutoUnsubscribeBase} from "../core/auto-unsubscribe-base";
import {Subject} from "rxjs";
import moment from "moment";

@AutoUnsubscribe
@Component({
  selector: "app-test-result",
  templateUrl: "./test-result.component.html",
  styleUrls: ["./test-result.component.less"]
})
export class TestResultComponent extends AutoUnsubscribeBase implements OnInit {

  public result: UserAnswers[];
  public test: Test;
  public testId: string;
  public mark: number = 0;
  private unsubscribeStream$: Subject<void> = new Subject<void>();
  public endTime: string;
  public startTime: string;

  constructor(private testPassingService: TestPassingService,
              private testService: TestService,
              private router: Router,
              private route: ActivatedRoute) {
    super();
  }

  ngOnInit() {
    this.startTime = moment(JSON.parse(localStorage.getItem("start"))).format("HH:mm:ss");
    this.endTime = moment(new Date).format("HH:mm:ss");
    this.testId = this.route.snapshot.queryParamMap.get("testId");
    const user = JSON.parse(localStorage.getItem("currentUser"));
    this.testService.getTestById(this.testId)
      .pipe(takeUntil(this.unsubscribeStream$))
      .subscribe((test) => {
        this.test = test;
      });
    this.testPassingService.getAnswersByStudentAndTest(user.id, this.testId)
      .pipe(takeUntil(this.unsubscribeStream$))
      .subscribe(result => {
        this.result = result;
        console.log("this.result", this.result);
        this.result.forEach(result => {
          if (result.Points !== 0)
            this.mark += 1;
        });
      });

  }

  public navigate(): void {
    this.router.navigate(["/test-control"]);
  }
}
