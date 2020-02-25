import { Component, OnInit } from '@angular/core';
import {TestPassingService} from "../service/test-passing.service";
import {switchMap} from "rxjs/operators";
import {ActivatedRoute} from "@angular/router";
import {UserAnswers} from "../models/user-answers.model";
import {TestService} from "../service/test.service";
import {Test} from "../models/test.model";

@Component({
  selector: 'app-test-result',
  templateUrl: './test-result.component.html',
  styleUrls: ['./test-result.component.less']
})
export class TestResultComponent implements OnInit {

  public result: UserAnswers[];
  public test: Test;
  public testId: string;
  public mark: number = 0;

  constructor(private testPassingService: TestPassingService,
              private testService: TestService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.testId = this.route.snapshot.queryParamMap.get('testId');
    this.testService.getTestTestById(this.testId).subscribe((test)=>{
      this.test = test;
    });
    this.testPassingService.getNextQuestion(this.testId, "1")
      .pipe(switchMap(() => this.testPassingService.getAnswersByStudentAndTest("10031", this.testId)
      ))
      .subscribe(result => {
        this.result = result;
        console.log("this.result", this.result);
        this.result.forEach(result=>{
          if (result.Points !== 0)
            this.mark += 1;
        })
      });

  }

}
