import {ChangeDetectorRef, Component, OnDestroy, OnInit} from "@angular/core";
import {ConfirmationService} from "../services/confirmation.service";
import {takeUntil, tap} from "rxjs/operators";
import {iif, Subject} from "rxjs";
import {MatSnackBar, MatTableDataSource} from "@angular/material";
import { Group } from "../models/group.model";
import { Student } from "../models/student.model";
import { CatsMessageService } from "../services/cats-message.service";
import { Message } from "../models/message.model";


@Component({
  selector: "app-confirmation",
  templateUrl: "./confirmation.component.html",
  styleUrls: ["./confirmation.component.less"]
})
export class ConfirmationComponent implements OnInit, OnDestroy {
  public groups: Group[] = [];
  public selectedGroup: number;
  public students: Student[] = [];
  public displayedColumns: string[] = ["id", "name", "action"];
  private unsubscribeStream$: Subject<void> = new Subject<void>();

  constructor(
    private confirmationService: ConfirmationService,
    private snackBar: MatSnackBar,
    private catsMessageService: CatsMessageService
    ) {
  }

  search: string = '';

  ngOnInit() {
    this.confirmationService.getGroups()
      .pipe(
        tap((groups: any) => {
          if (groups && groups.Groups) {
            this.groups = groups.Groups;
          }
          this.onGroupValueChange(this.groups && this.groups[0].GroupId);
        }),
        takeUntil(this.unsubscribeStream$)
      ).subscribe();
  }

  public onGroupValueChange(event): void {
    this.selectedGroup = event;
    this.students = [];
    this.confirmationService.getStudents(event)
      .pipe(
        takeUntil(this.unsubscribeStream$)
      ).subscribe(students => {
        this.students = students.Students;
      });
  }


  public confirm(student: Student, confirm = true): void {
    iif(() => confirm, this.confirmationService.confirmationStudent(student.StudentId), this.confirmationService.unconfirmationStudent(student.StudentId))
      .pipe(
        takeUntil(this.unsubscribeStream$)
      ).subscribe(response => {
        this.openSnackBar(response.Message);
        this.onGroupValueChange(this.selectedGroup);
        this.updateGroupUncofirmedStudents(confirm);
        this.catsMessageService.sendMessage(new Message('Comfirmation', confirm ? '-1' : '1'));

      });
  }

  private updateGroupUncofirmedStudents(increase: boolean = true): void {
    this.groups = this.groups.map(
      (group): Group => +group.GroupId === +this.selectedGroup ? { ...group, CountUnconfirmedStudents: group.CountUnconfirmedStudents + (increase ? 1 : -1) } : group
      );
  }

  public openSnackBar(message: string, action?: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  public ngOnDestroy(): void {
    this.unsubscribeStream$.next(null);
    this.unsubscribeStream$.complete();
  }

}
