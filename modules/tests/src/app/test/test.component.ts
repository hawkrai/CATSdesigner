import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {TestPassingService} from '../service/test-passing.service';
import {TestDescription} from '../models/test-description.model';


@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  public test: TestDescription;

  constructor(private route: ActivatedRoute,
              private testPassingService: TestPassingService) {
  }

  ngOnInit() {
    const testId = this.route.snapshot.paramMap.get('id');
    this.testPassingService.getTestDescription(testId).subscribe((test) => {
      this.test = test;
    });
  }

}
