import {Component, Input, OnInit} from '@angular/core';
import {TestDescription} from '../models/test-description.model';
import {ActivatedRoute, Router} from "@angular/router";


@Component({
  selector: 'app-test-description',
  templateUrl: './test-description.component.html',
  styleUrls: ['./test-description.component.less']
})
export class TestDescriptionComponent implements OnInit {

  @Input()
  public test: TestDescription;

  constructor(private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
  }

  public startTest() {
    const testId = this.route.snapshot.paramMap.get('id');
    this.router.navigate(['/test-passing/' + testId]);
  }
}
