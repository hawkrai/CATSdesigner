import {Component, OnInit} from '@angular/core';
import {TestPassingService} from '../service/test-passing.service';
import {TestQuestion} from '../models/question/test-question.model';
import {ActivatedRoute} from "@angular/router";
import {TestService} from "../service/test.service";
import {Test} from "../models/test.model";


@Component({
  selector: 'app-test-execution',
  templateUrl: './test-execution.component.html',
  styleUrls: ['./test-execution.component.css']
})
export class TestExecutionComponent implements OnInit {
  public question: TestQuestion;
  public questionNumber: string;
  public testId: string;
  public test: Test;

  constructor(private testPassingService: TestPassingService,
              private testService: TestService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.testId = this.route.snapshot.paramMap.get('id');
    this.questionNumber = '1';
    this.testService.getTestTestById(this.testId).subscribe((test) => {
      this.test = test;
    });
    this.testPassingService.getNextQuestion(this.testId, this.questionNumber).subscribe((question: TestQuestion) => {
      this.question = question;
    });
  }

  public nextQuestion(questionNumber?): void {
    this.questionNumber = questionNumber ? questionNumber : Number(this.questionNumber) + 1;
    this.testPassingService.getNextQuestion(this.testId, this.questionNumber).subscribe((question: TestQuestion) => {
      this.question = question;
    });
  }
}
