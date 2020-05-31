import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {FormControl, FormGroup} from "@angular/forms";
import {AutocompleteModel} from "../../models/autocomplete.model";


@Component({
  selector: "app-autocomplete-form",
  templateUrl: "./autocomplete-form.component.html",
  styleUrls: ["./autocomplete-form.component.less"]
})
export class AutocompleteFormComponent implements OnInit {
  @Input()
  public options: AutocompleteModel[];
  @Input()
  public placeholder: string;
  @Input()
  public preselected: boolean;
  profileForm = new FormGroup({
    selected: new FormControl()
  });
  @Output()
  public onSelectionChange: EventEmitter<string[]> = new EventEmitter();


  constructor() {
  }

  public ngOnInit(): void {
    if (this.preselected) {
      this.profileForm.controls.selected.setValue([this.options && this.options[0] && this.options[0].value]);
    }
    console.log(this.profileForm);
  }

  public onSubmit() {
    console.log(this.profileForm.value);
  }

  public selectionChange(event: string[]): void {
    if (event && event.length) {
      console.log(event);
      this.onSelectionChange.emit(event);
    } else {
      if (this.preselected) {
        this.onSelectionChange.emit([this.options && this.options[0] && this.options[0].value]);
        console.log([this.options && this.options[0] && this.options[0].value]);
      } else {
        this.onSelectionChange.emit(event);
      }
    }
  }


}
