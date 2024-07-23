import { Component, Input, OnInit } from '@angular/core'
import { TestDescription } from '../models/test-description.model'
import { ActivatedRoute, Router } from '@angular/router'
import { TestPassingService } from '../service/test-passing.service' // Импортируем сервис

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
    this.testPassingService
      .CloseTestAndGetResult(testId)
      .subscribe((result) => {
        this.router.navigate(['/test-control'])
      })
  }
}
