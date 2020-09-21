import {Component, Input, OnChanges, OnInit, SimpleChanges} from "@angular/core";
import {TestPassingService} from "../service/test-passing.service";
import {Test} from "../models/test.model";
import {AutoUnsubscribe} from "../decorator/auto-unsubscribe";
import {AutoUnsubscribeBase} from "../core/auto-unsubscribe-base";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {AutocompleteModel} from "../models/autocomplete.model";


@AutoUnsubscribe
@Component({
  selector: "app-result-pupil",
  templateUrl: "./result-pupil.component.html",
  styleUrls: ["./result-pupil.component.less"]
})
export class ResultPupilComponent extends AutoUnsubscribeBase implements OnInit {

  public results: Test[];
  @Input()
  public filterValue: any;
  public loading: boolean;
  public knowledgeControlTests: Test[];
  public selfControlTests: Test[];
  public nNTests: Test[];
  public beforeEUMKTests: Test[];
  public forEUMKTests: Test[];
  public options: AutocompleteModel[] = [];
  private unsubscribeStream$: Subject<void> = new Subject<void>();
  public visibleTests: string[];

  constructor(private testPassingService: TestPassingService) {
    super();
  }

  ngOnInit() {
    const subject = JSON.parse(localStorage.getItem("currentSubject"));
    this.testPassingService.getStudentResults(subject.id)
      .pipe(takeUntil(this.unsubscribeStream$))
      .subscribe((results) => {
        this.results = results;
        this.groupTests(results);
      });
  }

  /*public onValueChange(value: string): void {
    const filteredTests = this.results && this.results.filter((result) => {
      return result.Title.includes(value);
    });
    if (filteredTests) {
      this.groupTests(filteredTests);
    }
  }*/

  private groupTests(results: Test[]): void {
    this.loading = true;
    this.knowledgeControlTests = [];
    this.selfControlTests = [];
    this.nNTests = [];
    this.beforeEUMKTests = [];
    this.forEUMKTests = [];
    results.forEach((result) => {
      if (result.ForSelfStudy) {
        if (this.selfControlTests.length === 0) {
          this.options.push({display: "Тесты для самоконтроля", value: "0"});
        }
        this.selfControlTests.push(result);
      } else if (result.ForNN) {
        if (this.nNTests.length === 0) {
          this.options.push({display: "Тесты для обучения с искусственной нейронной сетью", value: "1"});
        }
        this.nNTests.push(result);
      } else if (result.BeforeEUMK) {
        if (this.beforeEUMKTests.length === 0) {
          this.options.push({display: "Предтест для обучения в ЭУМК", value: "2"});
        }
        this.beforeEUMKTests.push(result);
      } else if (result.ForEUMK) {
        if (this.forEUMKTests.length === 0) {
          this.options.push({display: "Тесты для обучения в ЭУМК", value: "3"});
        }
        this.forEUMKTests.push(result);
      } else {
        if (this.knowledgeControlTests.length === 0) {
          this.options.push({display: "Тесты для контроля знаний", value: "4"});
        }
        this.knowledgeControlTests.push(result);
      }
    });
    this.loading = false;
  }

  public optionChange(event): void{
    this.visibleTests = event;
    console.log(event);
  }
}
