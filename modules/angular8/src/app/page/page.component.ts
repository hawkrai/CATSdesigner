import {Component, OnInit} from '@angular/core';
import {TestPassingService} from '../service/test-passing.service';
import {TestAvailable} from '../models/test-available.model';


@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css']
})
export class PageComponent implements OnInit {

  public knowledgeControlTests: TestAvailable[] = [];
  public selfControlTests: TestAvailable[] = [];
  public nNTests: TestAvailable[] = [];
  public loading: boolean;
  public allTests: TestAvailable[];

  constructor(private testPassingService: TestPassingService) {
  }

  ngOnInit() {
    this.getTests('1');
  }

  private getTests(subjectId): void {
    this.testPassingService.getAvailableTests().subscribe((tests) => {
      this.allTests = tests;
      this.sortTests(tests);
    });
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
  }
}
