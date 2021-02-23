import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {SubGroup} from "../../../../../models/sub-group.model";


@Component({
  selector: "app-students-table",
  templateUrl: "./students-table.component.html",
  styleUrls: ["./students-table.component.less"]
})
export class StudentsTableComponent implements OnInit {

  @Input()
  public title: string;

  @Input()
  public subGroup: SubGroup;

  @Output()
  public onChangeAvailability: EventEmitter<any> = new EventEmitter();

  @Output()
  public onChangeAvailabilityForAll: EventEmitter<any> = new EventEmitter();

  displayedColumns: string[] = ["Name", "action"];


  constructor() {
  }

  ngOnInit() {
  }

  public changeAvailability(studentId, availability: boolean): void {
    this.onChangeAvailability.emit({studentId, availability});
  }

  public changeAvailabilityForAll(availability: boolean): void {
    //todo kostbI/\b should not send IDs
    let studentIdsRequest = [];
    for (let students of this.subGroup.Students) {
      studentIdsRequest.push(students.Id);
    }
    this.onChangeAvailabilityForAll.emit({availability, studentIdsRequest});
  }
}
