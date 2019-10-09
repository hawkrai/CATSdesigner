import {ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {TestService} from "../../../service/test.service";
import {Group} from "../../../models/group.model";
import {SubGroup} from "../../../models/sub-group.model";
import {TestAvailabilityRequest} from "../../../models/testAvailabilityRequest.model";


@Component({
  selector: 'app-edit-availability-popup',
  templateUrl: './edit-availability-popup.component.html',
  styleUrls: ['./edit-availability-popup.component.less']
})
export class EditAvailabilityPopupComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<EditAvailabilityPopupComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private testService: TestService,
              private cdr: ChangeDetectorRef) {
  }

  public groups: Group[];
  public subGroups: SubGroup[];
  public subGroupsDefault: SubGroup[];
  public groupId: number;

  ngOnInit() {
    this.testService.getGroupsBySubjectId("3").subscribe((groups) => {
      this.groups = groups;
      this.groupId = groups[0].Id;
      this.getSubGroups();
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public getSubGroups(): void {
    this.testService.getSubGroupsBySubjectIdGroupIdTestId("3", this.data.event, this.groupId).subscribe((subGroups) => {
      this.subGroups = subGroups;
      this.subGroupsDefault = subGroups;
    })
  }

  public onValueChange(event): void {
    this.subGroups = null;
    this.subGroupsDefault = null;
    this.groupId = event.source.value;
    this.getSubGroups();
  }

  public changeTestAvailability(event: any): void {
    let testAvailabilityRequest: TestAvailabilityRequest = new TestAvailabilityRequest();
    testAvailabilityRequest.studentId = event.studentId;
    testAvailabilityRequest.testId = this.data.event;
    //todo why different unlock and unlocked
    testAvailabilityRequest.unlocked = event.availability;
    this.testService.changeAvailabilityForStudent(testAvailabilityRequest).subscribe(() => {
      this.getSubGroups();
      this.cdr.detectChanges();
    })
  }

  public changeTestAvailabilityForAll(event: any): void {
    let testAvailabilityRequest: TestAvailabilityRequest = new TestAvailabilityRequest();
    //TOdo not to send students id. goup and subgroup
    testAvailabilityRequest.studentIds = event.studentIdsRequest;
    testAvailabilityRequest.testId = this.data.event;
    //todo why different unlock and unlocked
    testAvailabilityRequest.unlock = event.availability;
    this.testService.changeAvailabilityForAllStudents(testAvailabilityRequest).subscribe(() => {
      this.getSubGroups();
      this.cdr.detectChanges();
    })
  }

  public onSearchValueChange(event): void {
    this.subGroups = (JSON.parse(JSON.stringify(this.subGroupsDefault)));
    this.subGroups.forEach((student) => {
      student.Students = (student.Students.filter((student) => {
        return student.Name.includes(event.currentTarget.value);
      }));
    });
  }
}
