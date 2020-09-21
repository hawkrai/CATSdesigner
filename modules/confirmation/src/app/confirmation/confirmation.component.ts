import {ChangeDetectorRef, Component, OnDestroy, OnInit} from "@angular/core";
import {ConfirmationService} from "../service/confirmation.service";
import {takeUntil, tap} from "rxjs/operators";
import {Subject} from "rxjs";
import {MatSnackBar, MatTableDataSource} from "@angular/material";


@Component({
  selector: "app-confirmation",
  templateUrl: "./confirmation.component.html",
  styleUrls: ["./confirmation.component.less"]
})
export class ConfirmationComponent implements OnInit, OnDestroy {
  public groups = [];
  public selectedGroup;
  public students: any = [];
  public displayedColumns: string[] = ["id", "name", "action"];
  public dataSource: any;
  private unsubscribeStream$: Subject<void> = new Subject<void>();

  constructor(private confirmationService: ConfirmationService,
              private snackBar: MatSnackBar,
              private cdr: ChangeDetectorRef) {
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit() {
    this.confirmationService.getGroups()
      .pipe(
        tap((groups: any) => {
          if (groups && groups.Groups) {
            groups.Groups.forEach((group: any) => {
              this.groups.push({id: group.GroupId, value: group.GroupName + " - (" + group.CountUnconfirmedStudents + ")"});
            });
          }
          this.onGroupValueChange(this.groups && this.groups[0].id);
        }),
        takeUntil(this.unsubscribeStream$)
      ).subscribe();
  }

  public onGroupValueChange(event): void {
    this.selectedGroup = event;
    this.students = [];
    console.log("event.source.value " + event);
    this.confirmationService.getStudents(event)
      .pipe(
        tap((students) => {
          students.Students.forEach((student) => {
            this.students.push({id: student.StudentId, name: student.FullName, confirmed: student.Confirmed});
          });
          this.dataSource = new MatTableDataSource(this.students);
          this.cdr.detectChanges();
        }),
        takeUntil(this.unsubscribeStream$)
      ).subscribe();
  }

  public open(student): void {
    this.confirmationService.confirmationStudent(student.id)
      .pipe(
        tap((response) => {
          this.openSnackBar(response.Message);
          this.onGroupValueChange(this.selectedGroup);
        }),
        takeUntil(this.unsubscribeStream$)
      ).subscribe();
  }

  public close(student): void {
    this.confirmationService.unconfirmationStudent(student.id)
      .pipe(
        tap((response) => {
          this.openSnackBar(response.Message);
          this.onGroupValueChange(this.selectedGroup);
        }),
        takeUntil(this.unsubscribeStream$)
      ).subscribe();
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
