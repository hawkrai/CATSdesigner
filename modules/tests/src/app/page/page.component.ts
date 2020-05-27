import {Component, OnInit} from '@angular/core';
import {TestPassingService} from '../service/test-passing.service';
import {Test} from "../models/test.model";
import {AutoUnsubscribeBase} from "../core/auto-unsubscribe-base";
import {AutoUnsubscribe} from "../decorator/auto-unsubscribe";
import {takeUntil} from "rxjs/operators";
import {Subject} from "rxjs";


@AutoUnsubscribe
@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.less']
})
export class PageComponent extends AutoUnsubscribeBase implements OnInit {

  public knowledgeControlTests: Test[] = [];
  public selfControlTests: Test[] = [];
  public nNTests: Test[] = [];
  public loading: boolean;
  public allTests: Test[];
  public currentTabIndex: number = 0;
  public filterResult: string = "";
  private unsubscribeStream$: Subject<void> = new Subject<void>();

  constructor(private testPassingService: TestPassingService) {
    super();
  }

  ngOnInit() {
    const subject = JSON.parse(localStorage.getItem("currentSubject"));
    this.getTests(subject.id);
  }

  public sortTests(tests) {
    this.loading = true;
    this.knowledgeControlTests = [];
    this.selfControlTests = [];
    this.nNTests = [];
    tests.forEach((test) => {
      if (test.ForSelfStudy) {
        this.selfControlTests.push(test);
      } else if (test.ForNN) {
        this.nNTests.push(test);
      } else {
        this.knowledgeControlTests.push(test);
      }
    });
    this.loading = false;
  }

  public filterTests(searchValue: string): void {
    const filteredTests = this.allTests.filter((test) => {
      return test.Title.includes(searchValue);
    });
    this.sortTests(filteredTests);
    this.filterResult = searchValue;

  }

  public onChange(event: any): void {
    this.currentTabIndex = event.index;
    console.log(event);
  }

  private getTests(subjectId): void {
    this.testPassingService.getAvailableTests(subjectId)
      .pipe(takeUntil(this.unsubscribeStream$))
      .subscribe((tests) => {
        this.allTests = tests;
        this.sortTests(tests);
      });
  }
}
