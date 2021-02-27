import {ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges} from "@angular/core";
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
import {Results} from "../models/results.model";
import {TranslatePipe} from "../../../../../container/src/app/pipe/translate.pipe";


@AutoUnsubscribe
@Component({
  selector: "app-result-teacher",
  templateUrl: "./result-teacher.component.html",
  styleUrls: ["./result-teacher.component.less"]
})
export class ResultTeacherComponent extends AutoUnsubscribeBase implements OnInit, OnChanges {
  @Input()
  public size: number;
  public results: Result[];
  public resultsOriginal: Result[][] = [];
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
  public testsList: AutocompleteModel[];
  public filterStudentsString: string;
  public groupId: number;
  public groupChangeCheckBoxes: string[] = [];
  public testChangeCheckBoxes: string[] = ["0"];
  public studentChangeCheckBoxes: string[] = [];
  //todo any delete
  public user: any;
  public subject: any;
  private unsubscribeStream$: Subject<void> = new Subject<void>();

  constructor(private testService: TestService,
              private cdr: ChangeDetectorRef,
              private translatePipe: TranslatePipe,
              private testPassingService: TestPassingService) {
    super();
  }

  public ngOnInit(): void {
    this.initArrays();
    this.user = JSON.parse(localStorage.getItem("currentUser"));
    this.subject = JSON.parse(localStorage.getItem("currentSubject"));
    this.testsList = [{display: this.translatePipe.transform("text.tests.for.control", "Тесты для контроля знаний"), value: "0"},
      {display: this.translatePipe.transform("text.tests.for.self.control", "Тесты для самоконтроля"), value: "1"},
      {display: this.translatePipe.transform("text.tests.for.pre.eumk", "Предтест для обучения в ЭУМК"), value: "2"},
      {display: this.translatePipe.transform("text.tests.for.eumk", "Тесты для обучения в ЭУМК"), value: "3"},
      {display: this.translatePipe.transform("text.tests.for.nn", "Тесты для обучения с искусственной нейронной сетью"), value: "4"}];
    this.testService.getGroupsBySubjectId(this.subject.id)
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
    this.testPassingService.getResultsByGroupsAndSubject([groupId], this.subject.id)
      .pipe(
        takeUntil(this.unsubscribeStream$),
        finalize(() => this.loading = false)
      )
      .subscribe((results: Results[]) => {
        const groupName: AutocompleteModel = this.groupsList.find((group: AutocompleteModel) => group.value.toString() === results[0].GroupId.toString());
        this.results = results[0].Results;
        this.results.forEach((result: Result) => {
          result.groupName = groupName.display;
          result.groupId = groupName.value;
        });
        this.resultsOriginal.push(results[0].Results);
        this.resultsOriginal.forEach((results: Result[]) => {
          results.forEach((result: Result) => {
            result.groupName = groupName.display;
            result.groupId = groupName.value;
          });
        });
        /*console.log("decompose 1");
        this.decomposeResult(results[0].Results);*/
      });
  }

  /*public filterStudents(event: string): void {
    let results = this.resultsOriginal && this.resultsOriginal.filter(result => result.StudentName.toLowerCase().includes(event.toLowerCase()));
    this.decomposeResult(results);
    this.cdr.detectChanges();
  }*/

  /*public filterStudentsLogin(event: string[]): void {
    let results;
    if (event && event.length) {
      results = this.resultsOriginal && this.resultsOriginal.filter(result => event.includes(result.Login));
    } else {
      results = this.resultsOriginal;
    }
    this.decomposeResult(results);
    this.cdr.detectChanges();
  }*/
  public filterStudentsLogin(event: string[]): void {
    this.initArraysMass();

    let results: Result[][] = [];
    if (event && event.length) {
      this.resultsOriginal && this.resultsOriginal.forEach((resultsOriginal: Result[]) => {
        results.push(resultsOriginal.filter(result => event.includes(result.Login)));
      });
    } else {
      results = this.resultsOriginal;
    }
    results.forEach((result: Result[]) => {
      console.log("decompose 2");
      this.decomposeResult(result, true);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    /*if (changes.groupId) {
      this.getResults(changes.groupId.currentValue);
    }
    this.filterStudents(this.filterStudentsString);
    this.cdr.detectChanges();*/
  }

  public groupChange(eventChange) {
    if (eventChange.length && this.groupChangeCheckBoxes !== eventChange) {
      console.log(eventChange);
      this.groupChangeCheckBoxes = eventChange;
      this.testPassingService.getResultsByGroupsAndSubject(eventChange, this.subject.id).subscribe((results: Results[]) => {
        this.initArraysMass();
        this.resultsOriginal = [];
        this.studentList = [];
        results.forEach((results: Results) => {
          this.resultsOriginal.push(results.Results);
          this.resultsOriginal.forEach((resultsOriginal: Result[]) => {
            resultsOriginal.forEach((result: Result) => {
              if (!result.groupName) {
                const groupName: AutocompleteModel = this.groupsList.find((group: AutocompleteModel) => Number(group.value) === results.GroupId);
                result.groupName = groupName.display;
                result.groupId = groupName.value;
                console.log("result.groupName = groupName.display");
              }
            });
          });
        });
        /*this.resultsOriginal.forEach((resultsOriginal: Result[])=>{
          const groupName: AutocompleteModel = this.groupsList.find((group: AutocompleteModel) => group.value.toString() === resultsOriginal.GroupId.toString());

        });*/

        this.resultsOriginal.forEach((res) => {
          console.log("decompose 3");
          this.decomposeResult(res);
        });
        console.log("rer");
        console.log(results);
      });
    }
  }

  public testsChange(eventChange) {
    if (this.testChangeCheckBoxes !== eventChange) {
      this.testChangeCheckBoxes = eventChange;
    }
  }

  public studentChange(eventChange) {
    if ((this.studentChangeCheckBoxes.length || eventChange.length) && this.studentChangeCheckBoxes !== eventChange) {
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

  }

  private initArraysMass(): void {
    this.knowledgeControlTestsMass = [];
    this.selfControlTestsMass = [];
    this.nNTestsMass = [];
    this.beforeEUMKTestsMass = [];
    this.forEUMKTestsMass = [];
  }

  private initArray(test): void {
    for (let i = 0; i < 3; i++) {
      test[i] = new Map<string, ResultForTable>();

    }
  }

  private decomposeResult(results: Result[], notTouchStList?: boolean): void {
    if (results) {
      results.forEach((result) => {
          if (!notTouchStList) {
            this.studentList.push({value: result.Login, display: result.StudentName});
          }
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
      const groupName = results && results.length && results[0].groupName;
      const groupId = results && results.length && results[0].groupId;
      if (!this.knowledgeControlTestsMass.some(test => test.group === groupName)) {
        this.knowledgeControlTestsMass.push({res: Object.assign({}, this.knowledgeControlTests), group: groupName, groupId});
        this.selfControlTestsMass.push({res: Object.assign({}, this.selfControlTests), group: groupName, groupId});
        this.nNTestsMass.push({res: Object.assign({}, this.nNTests), group: groupName, groupId});
        this.beforeEUMKTestsMass.push({res: Object.assign({}, this.beforeEUMKTests), group: groupName, groupId});
        this.forEUMKTestsMass.push({res: Object.assign({}, this.forEUMKTests), group: groupName, groupId});
        this.initArrays();
      }
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
