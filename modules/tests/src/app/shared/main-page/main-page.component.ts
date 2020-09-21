import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {Group} from "../../models/group.model";


@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.less']
})
export class MainPageComponent implements OnChanges {

  @Input()
  public allowChanges: boolean;

  @Input()
  public forNN: boolean;

  @Input()
  public adminTests: boolean;

  @Input()
  public adminQuestions: boolean;

  @Input()
  public hideSearch: boolean;

  @Input()
  public groupDropdown: boolean;

  @Input()
  public text: string;

  @Input()
  public inputValue: string;

  @Input()
  public groups: Group[];

  @Output()
  public onValueChangeSearch: EventEmitter<string> = new EventEmitter();

  @Output()
  public onOpenAddingPopupEvent: EventEmitter<void> = new EventEmitter();

  @Output()
  public groupValueChange: EventEmitter<any> = new EventEmitter();

  @Output()
  public addNewQuestion: EventEmitter<any> = new EventEmitter();

  @Output()
  public addQuestionFromOtherTestEvent: EventEmitter<any> = new EventEmitter();

  constructor() {
  }

  public onValueChange(event): void {
    this.onValueChangeSearch.emit(event.currentTarget.value);
  }

  public onGroupValueChange(event): void {
    console.log("event.source.value " + event.source.value);
    this.groupValueChange.emit(event.source.value);
  }

  public onOpenAddingPopup(): void {
    this.onOpenAddingPopupEvent.emit();
  }

  public onAddNewQuestion(): void {
    this.addNewQuestion.emit();
  }

  public addQuestionFromOtherTest(): void {
    this.addQuestionFromOtherTestEvent.emit();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log("ngOnChanges - MainPageComponent " + this.inputValue);
  }
}
