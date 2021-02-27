import {ChangeDetectorRef, Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {TestService} from "../../../service/test.service";
import {Group} from "../../../models/group.model";
import {SubGroup} from "../../../models/sub-group.model";
import {TestAvailabilityRequest} from "../../../models/testAvailabilityRequest.model";
import {AutoUnsubscribe} from "../../../decorator/auto-unsubscribe";
import {AutoUnsubscribeBase} from "../../../core/auto-unsubscribe-base";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";


@AutoUnsubscribe
@Component({
  selector: "app-edit-availability-popup",
  templateUrl: "./edit-availability-popup.component.html",
  styleUrls: ["./edit-availability-popup.component.less"]
})
export class EditAvailabilityPopupComponent extends AutoUnsubscribeBase implements OnInit {

  public groups: Group[];
  public subGroups: SubGroup[];
  public subGroupsDefault: SubGroup[];
  public groupId: number;
  private unsubscribeStream$: Subject<void> = new Subject<void>();

  constructor(public dialogRef: MatDialogRef<EditAvailabilityPopupComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private testService: TestService,
              private cdr: ChangeDetectorRef) {
    super();
  }

  ngOnInit() {
    const subject = JSON.parse(localStorage.getItem("currentSubject"));
    this.testService.getGroupsBySubjectId(subject?.id)
      .pipe(takeUntil(this.unsubscribeStream$))
      .subscribe((groups) => {
        this.groups = groups;
        this.groupId = groups[0].Id;
        this.getSubGroups();
      });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public getSubGroups(): void {
    const subject = JSON.parse(localStorage.getItem("currentSubject"));

    this.testService.getSubGroupsBySubjectIdGroupIdTestId(subject.id, this.data.event, this.groupId)
      .pipe(takeUntil(this.unsubscribeStream$))
      .subscribe((subGroups) => {
        this.subGroups = subGroups;
        this.subGroupsDefault = subGroups;
      });
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
    this.testService.changeAvailabilityForStudent(testAvailabilityRequest)
      .pipe(takeUntil(this.unsubscribeStream$))
      .subscribe(() => {
        this.getSubGroups();
        this.cdr.detectChanges();
      });
  }

  public changeTestAvailabilityForAll(event: any): void {
    let testAvailabilityRequest: TestAvailabilityRequest = new TestAvailabilityRequest();
    //TOdo not to send students id. goup and subgroup
    testAvailabilityRequest.studentIds = event.studentIdsRequest;
    testAvailabilityRequest.testId = this.data.event;
    //todo why different unlock and unlocked
    testAvailabilityRequest.unlock = event.availability;
    this.testService.changeAvailabilityForAllStudents(testAvailabilityRequest)
      .pipe(takeUntil(this.unsubscribeStream$))
      .subscribe(() => {
        this.getSubGroups();
        this.cdr.detectChanges();
      });
  }

  public onSearchValueChange(event): void {
    this.subGroups = (JSON.parse(JSON.stringify(this.subGroupsDefault)));
    this.subGroups.forEach((student) => {
      student.Students = (student.Students.filter((student) => {
        return student.Name.toLowerCase().includes(event.currentTarget.value.toLowerCase());
      }));
    });
  }
}
