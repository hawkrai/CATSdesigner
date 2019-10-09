import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TestQuestion} from '../../../models/question/test-question.model';
import {Answer} from '../../../models/question/answer.model';
import {TestPassingService} from '../../../service/test-passing.service';
import {TestAvailable} from "../../../models/test-available.model";


@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.less']
})
export class QuestionComponent implements OnInit {

  @Input()
  public question: TestQuestion;

  @Input()
  public questionNumber: string;

  @Input()
  public test: TestAvailable;

  public chosenAnswer: Answer;

  @Output()
  public goToNextQuestion: EventEmitter<any> = new EventEmitter();

  constructor(private testPassingService: TestPassingService) {
  }

  ngOnInit() {
  }

  public answerQuestion(): void {
    //todo hardcode
    const request = {
      answers: [{Id: '2523', IsCorrect: 0}
        , {Id: '2524', IsCorrect: 0}
        , {Id: '2522', IsCorrect: 0}
        , {Id: '2525', IsCorrect: 1}],
      questionNumber: 4,
      testId: 31
    };
    this.testPassingService.answerQuestionAndGetNext(request).subscribe((response) => {
      this.getOnNextQuestion();
    });
    console.log(this.chosenAnswer);
  }

  public getOnNextQuestion(): void {
    this.goToNextQuestion.emit();
  }
}
