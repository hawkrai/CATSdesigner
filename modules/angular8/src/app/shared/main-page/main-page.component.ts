import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';


@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {

  @Input()
  public allowChanges: boolean;

  @Output()
  public onValueChangeSearch: EventEmitter<string> = new EventEmitter();

  @Output()
  public onOpenAddingPopupEvent: EventEmitter<void> = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

  public onValueChange(event): void {
    this.onValueChangeSearch.emit(event.currentTarget.value);
  }

  public onOpenAddingPopup(): void {
    this.onOpenAddingPopupEvent.emit();
  }
}
