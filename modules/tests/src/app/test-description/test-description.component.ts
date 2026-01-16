import { Component, Input, OnInit } from '@angular/core'
import { TestDescription } from '../models/test-description.model'
import { Test } from '../models/test.model'
import { ActivatedRoute, Router } from '@angular/router'
import { TestPassingService } from '../service/test-passing.service'
import { catchError } from 'rxjs/operators'
import { of } from 'rxjs'

@Component({
  selector: 'app-test-description',
  templateUrl: './test-description.component.html',
  styleUrls: ['./test-description.component.less'],
})
export class TestDescriptionComponent implements OnInit {
  @Input()
  public test: TestDescription

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private testPassingService: TestPassingService
  ) {}

  ngOnInit() {}

  public startTest() {
    const testId = this.route.snapshot.paramMap.get('id')
    this.router.navigate(['/test-passing/' + testId])
  }

  public finishTest() {
    const testId = this.route.snapshot.paramMap.get('id')
    const subject = JSON.parse(localStorage.getItem('currentSubject'))
    const subjectId = subject?.id

    if (!subjectId) {
      this.completeTest(testId)
      return
    }

    this.testPassingService
      .getAvailableTests(subjectId)
      .pipe(
        catchError(() => of([] as Test[]))
      )
      .subscribe((tests: Test[]) => {
        const testExists = tests.some((t: Test) => 
          String(t.Id) === testId
        )

        if (testExists) {
          this.completeTest(testId)
        } else {
          this.router.navigate(['/test-control'], { 
          })
        }
      })
  }

  private completeTest(testId: string) {
    this.testPassingService
      .CloseTestAndGetResult(testId)
      .subscribe((result) => {
        this.router.navigate(['/test-control'])
      })
  }
}
