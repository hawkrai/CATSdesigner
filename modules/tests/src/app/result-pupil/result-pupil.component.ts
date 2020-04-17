import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {TestPassingService} from "../service/test-passing.service";
import {Test} from "../models/test.model";
import {AutoUnsubscribe} from "../decorator/auto-unsubscribe";
import {AutoUnsubscribeBase} from "../core/auto-unsubscribe-base";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";


@AutoUnsubscribe
@Component({
  selector: 'app-result-pupil',
  templateUrl: './result-pupil.component.html',
  styleUrls: ['./result-pupil.component.less']
})
export class ResultPupilComponent extends AutoUnsubscribeBase implements OnInit, OnChanges {

  public results: Test[];
  @Input()
  public filterValue: any;
  public loading: boolean;
  public knowledgeControlTests: Test[];
  public selfControlTests: Test[];
  public nNTests: Test[];
  public beforeEUMKTests: Test[];
  public forEUMKTests: Test[];
  private unsubscribeStream$: Subject<void> = new Subject<void>();

  constructor(private testPassingService: TestPassingService) {
    super();
  }

  ngOnInit() {
    this.testPassingService.getStudentResults("3")
      .pipe(takeUntil(this.unsubscribeStream$))
      .subscribe((results) => {
        this.results = results;
        this.groupTests(results);
      })
  }

  public onValueChange(value: string): void {
    const filteredTests = this.results && this.results.filter((result) => {
      return result.Title.includes(value);
    });
    if (filteredTests) {
      this.groupTests(filteredTests);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.onValueChange(this.filterValue);
  }

  private groupTests(results: Test[]): void {
    this.loading = true;
    this.knowledgeControlTests = [];
    this.selfControlTests = [];
    this.nNTests = [];
    this.beforeEUMKTests = [];
    this.forEUMKTests = [];
    results.forEach((result) => {
      if (result.ForSelfStudy) {
        this.selfControlTests.push(result);
      } else if (result.ForNN) {
        this.nNTests.push(result);
      } else if (result.BeforeEUMK) {
        this.beforeEUMKTests.push(result);
      } else if (result.ForEUMK) {
        this.forEUMKTests.push(result);
      } else {
        this.knowledgeControlTests.push(result);
      }
    });
    this.loading = false;
  }
}
