import {ChangeDetectorRef, Component, OnChanges, OnInit, SimpleChanges} from "@angular/core";
import {TestService} from "../service/test.service";
import {TestPassingService} from "../service/test-passing.service";
import {Group} from "../models/group.model";
import {Result} from "../models/result.model";
import {ResultForTable} from "../models/result-for-table.model";
import {AutoUnsubscribe} from "../decorator/auto-unsubscribe";
import {AutoUnsubscribeBase} from "../core/auto-unsubscribe-base";
import {Subject} from "rxjs";
import {finalize, takeUntil} from "rxjs/operators";
import {AutocompleteModel} from "../models/autocomplete.model";


@AutoUnsubscribe
@Component({
  selector: "app-result-teacher",
  templateUrl: "./result-teacher.component.html",
  styleUrls: ["./result-teacher.component.less"]
})
export class ResultTeacherComponent extends AutoUnsubscribeBase implements OnInit, OnChanges {
  public results: Result[];
  public resultsOriginal: Result[];
  public selfControlTests: ResultForTable[][] = [];
  public selfControlTestsMass: any = [];
  public nNTestsMass: any = [];
  public nNTests: ResultForTable[][] = [];
  public beforeEUMKTestsMass: any = [];
  public beforeEUMKTests: ResultForTable[][] = [];
  public forEUMKTestsMass: any = [];
  public forEUMKTests: ResultForTable[][] = [];
  public knowledgeControlTests: ResultForTable[][] = [];
  public knowledgeControlTestsMass: any = [];
  public loading: boolean;
  public groups: Group[];
  public groupsList: AutocompleteModel[] = [];
  public studentList: AutocompleteModel[] = [];
  public testsList: AutocompleteModel[] = [{display: "Тесты для контроля знаний", value: "0"},
    {display: "Тесты для самоконтроля", value: "1"},
    {display: "Предтест для обучения в ЭУМК", value: "2"},
    {display: "Тесты для обучения в ЭУМК", value: "3"},
    {display: "Тесты для обучения с искусственной нейронной сетью", value: "4"}];
  public filterStudentsString: string;
  public groupId: number;
  public groupChangeCheckBoxes: string[] = [];
  public testChangeCheckBoxes: string[] = ["0"];
  public studentChangeCheckBoxes: string[] = [];
  private unsubscribeStream$: Subject<void> = new Subject<void>();

  constructor(private testService: TestService,
              private cdr: ChangeDetectorRef,
              private testPassingService: TestPassingService) {
    super();
  }

  public ngOnInit(): void {
    this.testService.getGroupsBySubjectId("3")
      .pipe(takeUntil(this.unsubscribeStream$))
      .subscribe((groups: Group[]) => {
        this.groups = groups;
        groups.forEach((group: Group) => {
          // @ts-ignore
          this.groupsList.push({display: group.Name, value: <string>group.Id});
        });
        this.getResults(groups[0].Id);
      });
  }

  public getResults(groupId): void {
    this.loading = true;
    this.testPassingService.getResultsByGroupAndSubject(groupId, "3")
      .pipe(
        takeUntil(this.unsubscribeStream$),
        finalize(() => this.loading = false)
      )
      .subscribe((results: Result[]) => {
        const groupName: AutocompleteModel = this.groupsList.find((group: AutocompleteModel) => group.value === groupId);
        this.results = results;
        this.results.forEach((result: Result) => {
          result.groupName = groupName.value;
        });
        this.resultsOriginal = results;
        this.resultsOriginal.forEach((result: Result) => {
          result.groupName = groupName.value;
        });
        this.decomposeResult(results);
      });
  }

  public filterStudents(event: string): void {
    let results = this.resultsOriginal && this.resultsOriginal.filter(result => result.StudentName.toLowerCase().includes(event.toLowerCase()));
    this.decomposeResult(results);
    this.cdr.detectChanges();
  }

  public filterStudentsLogin(event: string[]): void {
    let results;
    if (event && event.length) {
      results = this.resultsOriginal && this.resultsOriginal.filter(result => event.includes(result.Login));
    } else {
      results = this.resultsOriginal;
    }
    this.decomposeResult(results);
    this.cdr.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.groupId) {
      this.getResults(changes.groupId.currentValue);
    }
    this.filterStudents(this.filterStudentsString);
    this.cdr.detectChanges();
  }

  public groupChange(eventChange) {
    if (this.groupChangeCheckBoxes !== eventChange) {
      this.groupChangeCheckBoxes = eventChange;
    }
  }

  public testsChange(eventChange) {
    if (this.testChangeCheckBoxes !== eventChange) {
      this.testChangeCheckBoxes = eventChange;
    }
  }

  public studentChange(eventChange) {
    if (this.studentChangeCheckBoxes !== eventChange) {
      this.studentChangeCheckBoxes = eventChange;
      this.filterStudentsLogin(eventChange);
    }
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
          this.studentList.push({value: result.Login, display: result.StudentName});
          let resultForTable: ResultForTable = new ResultForTable();
          resultForTable.test = [];
          resultForTable.name = result.StudentName;
          resultForTable.subGroup = result.SubGroup;
          resultForTable.StudentShortName = result.StudentShortName;
          resultForTable.id = result && result.TestPassResults[0] && result.TestPassResults[0].StudentId;

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
            testRes.percent = testPassResult.Percent;
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
      this.knowledgeControlTestsMass = [];
      this.selfControlTestsMass = [];
      this.nNTestsMass = [];
      this.beforeEUMKTestsMass = [];
      this.forEUMKTestsMass = [];
      this.knowledgeControlTestsMass.push({res: this.knowledgeControlTests, group: this.results && this.results.length && this.results[0].groupName});
      this.selfControlTestsMass.push({res: this.selfControlTests, group: this.results && this.results.length && this.results[0].groupName});
      this.nNTestsMass.push({res: this.nNTests, group: this.results && this.results.length && this.results[0].groupName});
      this.beforeEUMKTestsMass.push({res: this.beforeEUMKTests, group: this.results && this.results.length && this.results[0].groupName});
      this.forEUMKTestsMass.push({res: this.forEUMKTests, group: this.results && this.results.length && this.results[0].groupName});
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
}
