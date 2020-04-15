import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {TestPassingService} from '../service/test-passing.service';
import {TestDescription} from '../models/test-description.model';
import {AutoUnsubscribe} from "../decorator/auto-unsubscribe";
import {AutoUnsubscribeBase} from "../core/auto-unsubscribe-base";
import {takeUntil} from "rxjs/operators";
import {Subject} from "rxjs";

@AutoUnsubscribe
@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent extends AutoUnsubscribeBase implements OnInit {

  public test: TestDescription;
  private unsubscribeStream$: Subject<void> = new Subject<void>();

  constructor(private route: ActivatedRoute,
              private testPassingService: TestPassingService) {
    super();
  }

  ngOnInit() {
    const testId = this.route.snapshot.paramMap.get('id');
    this.testPassingService.getTestDescription(testId)
      .pipe(takeUntil(this.unsubscribeStream$))
      .subscribe((test) => {
      this.test = test;
    });
  }

}
