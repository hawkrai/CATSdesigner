import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {Question} from "../../models/question/question.model";


@Component({
  selector: "app-table-questions",
  templateUrl: "./table-questions.component.html",
  styleUrls: ["./table-questions.component.less"]
})
export class TableQuestionsComponent implements OnInit {

  @Input()
  public questions: Question[];

  @Output()
  public onOpenEditPopup: EventEmitter<any> = new EventEmitter();

  @Output()
  public onDeleteQuestion: EventEmitter<string> = new EventEmitter();

  public test: any;

  displayedColumns: string[] = ["Id", "Title", "action"];

  constructor() {
  }

  ngOnInit() {
  }

  public deleteQuestion(event): void {
    this.onDeleteQuestion.emit(event);
  }

  public openEditPopup(event): void {
    this.onOpenEditPopup.emit(event);
  }
}
