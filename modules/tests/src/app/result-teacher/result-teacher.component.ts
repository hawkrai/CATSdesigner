import {ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {TestService} from "../service/test.service";
import {TestPassingService} from "../service/test-passing.service";
import {Group} from "../models/group.model";
import {Result} from "../models/result.model";
import {ResultForTable} from "../models/result-for-table.model";
import {AutoUnsubscribe} from "../decorator/auto-unsubscribe";
import {AutoUnsubscribeBase} from "../core/auto-unsubscribe-base";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";


@AutoUnsubscribe
@Component({
  selector: 'app-result-teacher',
  templateUrl: './result-teacher.component.html',
  styleUrls: ['./result-teacher.component.less']
})
export class ResultTeacherComponent extends AutoUnsubscribeBase implements OnInit, OnChanges {

  public groups: Group[];
  public results: Result[];
  public resultsOriginal: Result[];
  public selfControlTests: ResultForTable[][] = [];
  public nNTests: ResultForTable[][] = [];
  public beforeEUMKTests: ResultForTable[][] = [];
  public forEUMKTests: ResultForTable[][] = [];
  public knowledgeControlTests: ResultForTable[][] = [];
  private unsubscribeStream$: Subject<void> = new Subject<void>();
  @Input()
  public filterStudentsString: string;

  constructor(private testService: TestService,
              private cdr: ChangeDetectorRef,
              private testPassingService: TestPassingService) {
    super();
  }

  ngOnInit() {
    this.testService.getGroupsBySubjectId("3")
      .pipe(takeUntil(this.unsubscribeStream$))
      .subscribe((groups) => {
        this.groups = groups;
        this.getResults(groups[0].Id);
      });
  }

  public getResults(groupId): void {
    this.testPassingService.getResultsByGroupAndSubject(groupId, "3")
      .pipe(takeUntil(this.unsubscribeStream$))
      .subscribe((results) => {
        this.results = results;
        this.resultsOriginal = results;
        this.decomposeResult(results);
      });
  }

  public filterStudents(event: string): void {
    let results = this.resultsOriginal && this.resultsOriginal.filter(result => result.StudentName.toLowerCase().includes(event.toLowerCase()));
    this.decomposeResult(results);
    this.cdr.detectChanges();
  }

  public groupValueChange(event: any): void {
    this.getResults(event);
    this.cdr.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.filterStudents(this.filterStudentsString);
  }

  private initArrays(): void {
    this.initArray(this.selfControlTests);
    this.initArray(this.nNTests);
    this.initArray(this.beforeEUMKTests);
    this.initArray(this.forEUMKTests);
    this.initArray(this.knowledgeControlTests);
    this.cdr.detectChanges();
  }

  private initArray(test): void {
    for (let i = 0; i < 3; i++) {
      test[i] = new Map<string, ResultForTable>();

    }
  }

  private decomposeResult(results: Result[]): void {
    this.initArrays();
    if (results) {
      results.forEach((result) => {

          let resultForTable: ResultForTable = new ResultForTable();
          resultForTable.test = [];
          resultForTable.name = result.StudentName;
          resultForTable.subGroup = result.SubGroup;
          resultForTable.StudentShortName = result.StudentShortName;
          resultForTable.id = result && result.TestPassResults && result.TestPassResults[0].StudentId;

          this.initTestArray(this.selfControlTests, resultForTable, result.Login);
          this.initTestArray(this.nNTests, resultForTable, result.Login);
          this.initTestArray(this.beforeEUMKTests, resultForTable, result.Login);
          this.initTestArray(this.forEUMKTests, resultForTable, result.Login);
          this.initTestArray(this.knowledgeControlTests, resultForTable, result.Login);
          result.TestPassResults.forEach((testPassResult) => {
            let testRes: any = {};
            testRes.testName = testPassResult.TestName;
            testRes.testId = testPassResult.TestId;
            testRes.studentId = testPassResult.StudentId;
            testRes.points = testPassResult.Points;
            if (testPassResult.ForSelfStudy) {
              this.sortBySubGroup(result, this.selfControlTests, testRes);
            } else if (testPassResult.ForNN) {
              this.sortBySubGroup(result, this.nNTests, testRes);
            } else if (testPassResult.BeforeEUMK) {
              this.sortBySubGroup(result, this.beforeEUMKTests, testRes);
            } else if (testPassResult.ForEUMK) {
              this.sortBySubGroup(result, this.forEUMKTests, testRes);
            } else {
              this.sortBySubGroup(result, this.knowledgeControlTests, testRes);
            }
          });
        }
      );
    }
  }

  private initTestArray(test, resultForTable, login): void {
    if (resultForTable.subGroup === "first") {
      test[0].set(login, JSON.parse(JSON.stringify(resultForTable)));
    } else if (resultForTable.subGroup === "second") {
      test[1].set(login, JSON.parse(JSON.stringify(resultForTable)));
    } else {
      test[2].set(login, JSON.parse(JSON.stringify(resultForTable)));
    }
  }

  private sortBySubGroup(result: Result, test, testRes) {
    if (result.SubGroup === "first") {
      test[0].get(result.Login).test.push(testRes);
    } else if (result.SubGroup === "second") {
      test[1].get(result.Login).test.push(testRes);
    } else {
      test[2].get(result.Login).test.push(testRes);
    }
  }

  /*public getUserAnswers(): void{
    this.testPassingService.getAnswersByStudentAndTest()
  }*/
}
