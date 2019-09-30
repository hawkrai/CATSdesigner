import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TestPassingService} from "../../service/test-passing.service";
import {Router} from "@angular/router";
import {Question} from "../../models/question/question.model";

@Component({
  selector: 'app-table-questions',
  templateUrl: './table-questions.component.html',
  styleUrls: ['./table-questions.component.less']
})
export class TableQuestionsComponent implements OnInit {

  @Input()
  public questions: Question[];

  @Output()
  public onOpenEditPopup: EventEmitter<any> = new EventEmitter();

  @Output()
  public onDeleteTest: EventEmitter<string> = new EventEmitter();

  public test: any;

  displayedColumns: string[] = ['Id', 'Title', 'action'];

  constructor() {
  }

  ngOnInit() {
  }
}
