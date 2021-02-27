import {ChangeDetectorRef, Component, OnInit} from "@angular/core";
import {TestService} from "../service/test.service";
import {MatDialog, MatSnackBar} from "@angular/material";
import {EditTestPopupComponent} from "./components/edit-test-popup/edit-test-popup.component";
import {DeleteConfirmationPopupComponent} from "./components/delete-confirmation-popup/delete-confirmation-popup.component";
import {EditAvailabilityPopupComponent} from "./components/edit-availability-popup/edit-availability-popup.component";
import {Router} from "@angular/router";
import {Test} from "../models/test.model";
import {AutoUnsubscribe} from "../decorator/auto-unsubscribe";
import {AutoUnsubscribeBase} from "../core/auto-unsubscribe-base";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {Group} from "../models/group.model";
import {TranslatePipe} from "../../../../../container/src/app/pipe/translate.pipe";


@AutoUnsubscribe
@Component({
  selector: "app-test-control-page",
  templateUrl: "./test-control-page.component.html",
  styleUrls: ["./test-control-page.component.less"]
})
export class TestControlPageComponent extends AutoUnsubscribeBase implements OnInit {

  public knowledgeControlTests: Test[] = [];
  public selfControlTests: Test[] = [];
  public nNTests: Test[] = [];
  public beforeEUMKTests: Test[] = [];
  public forEUMKTests: Test[] = [];
  public loading: boolean;
  public allowChanges: boolean = true;
  public allTests: Test[];
  public filterStudentsString: string = "";
  public inputValue: string = "";
  public filterCompletingString: string = "";
  //todo any delete
  public user: any;
  public subject: any;
  public allowDropdown: boolean;
  public adminTests: boolean = true;
  public groups: Group[];
  public groupId: number;
  public currentTabIndex: number = 0;
  public knowledgeControlTestsSize: number;
  private unsubscribeStream$: Subject<void> = new Subject<void>();
  private filterTestsString: string = "";

  constructor(private testService: TestService,
              private router: Router,
              private translatePipe: TranslatePipe,
              private snackBar: MatSnackBar,
              private cdr: ChangeDetectorRef,
              public dialog: MatDialog) {
    super();
  }

  ngOnInit() {
    /*this.testService.getFiles().subscribe((fda)=>{
      console.log(fda);
    })*/
    /*localStorage.setItem("currentUser",JSON.stringify({id:10031,role:"ds", userName:"popova"}));
    localStorage.setItem("currentSubject",JSON.stringify({id: "3", Name:"Тестирование ПО"}));
    localStorage.setItem("locale","rus");*/
    this.user = JSON.parse(localStorage.getItem("currentUser"));
    this.subject = JSON.parse(localStorage.getItem("currentSubject"));
    this.getTests(this.subject.id);
  }

  openDialog(event?: any): void {
    const dialogRef = this.dialog.open(EditTestPopupComponent, {
      width: "700px",
      data: {event}
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.unsubscribeStream$))
      .subscribe(result => {
        this.getTests(this.subject.id);
        this.cdr.detectChanges();
        console.log(result);
      });
  }

  public openAvailabilityDialog(event?: any): void {
    const dialogRef = this.dialog.open(EditAvailabilityPopupComponent, {
      width: "700px",
      data: {event}
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.unsubscribeStream$))
      .subscribe(result => {
        this.getTests(this.subject.id);
        this.cdr.detectChanges();
        console.log(result);
      });
  }

  public openConfirmationDialog(event: any): void {
    const dialogRef = this.dialog.open(DeleteConfirmationPopupComponent, {
      width: "500px",
      data: {event}
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.unsubscribeStream$))
      .subscribe(result => {
        if (result) {
          this.deleteTest(event);
        }
      });
  }

  public deleteTest(testId): void {
    this.testService.deleteTest(testId)
      .pipe(takeUntil(this.unsubscribeStream$))
      .subscribe(() => {
        this.getTests(this.subject.id);
      },error1 => {
        this.openSnackBar(this.translatePipe.transform('text.test.error.delete.test',"Не удалось удалить тест"));
      });
  }

  public openSnackBar(message: string, action?: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  public filterTests(searchValue: string): void {
    if (this.currentTabIndex === 0) {
      this.filterTestsString = searchValue;
      const filteredTests = this.allTests.filter((test) => {
        return test.Title.includes(searchValue);
      });
      this.sortTests(filteredTests);
    }
    else if (this.currentTabIndex === 1) {
      this.filterStudentsString = searchValue;
    }
    else if (this.currentTabIndex === 2) {
      this.filterCompletingString = searchValue;
    }
  }

  public onChange(event: any): void {
    this.currentTabIndex = event.index;
    switch (this.currentTabIndex) {
      case 0: {
        this.allowChanges = true;
        this.allowDropdown = false;
        this.adminTests = true;
        this.inputValue = this.filterTestsString;
        break;
      }
      case 1: {
        this.allowChanges = true;
        this.allowDropdown = true;
        this.adminTests = false;
        this.inputValue = this.filterStudentsString;
        break;
      }
      case 2: {
        this.allowChanges = false;
        this.allowDropdown = false;
        this.adminTests = false;
        this.inputValue = this.filterCompletingString;
        break;
      }
    }

  }

  public groupValueChange(event): void {
    this.groupId = event;
  }

  public navigateToQuestions(event): void {
    this.router.navigate(["/questions/" + event]);
  }

  private getTests(subjectId): void {
    this.testService.getAllTestBySubjectId(subjectId)
      .pipe(takeUntil(this.unsubscribeStream$))
      .subscribe((tests) => {
        this.allTests = tests;
        this.sortTests(tests);
        this.knowledgeControlTestsSize = this.knowledgeControlTests.length;
      });
  }

  private sortTests(tests): void {
    this.loading = true;
    this.knowledgeControlTests = [];
    this.selfControlTests = [];
    this.nNTests = [];
    this.beforeEUMKTests = [];
    this.forEUMKTests = [];
    tests.forEach((test) => {
      if (test.ForSelfStudy) {
        this.selfControlTests.push(test);
      } else if (test.ForNN) {
        this.nNTests.push(test);
      } else if (test.BeforeEUMK) {
        this.beforeEUMKTests.push(test);
      } else if (test.ForEUMK) {
        this.forEUMKTests.push(test);
      } else {
        this.knowledgeControlTests.push(test);
      }
    });
    this.loading = false;
  }
}
