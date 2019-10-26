import {Component, OnInit} from '@angular/core';
import {TestService} from '../service/test.service';
import {TestAvailable} from '../models/test-available.model';
import {MatDialog} from '@angular/material';
import {EditTestPopupComponent} from './components/edit-test-popup/edit-test-popup.component';
import {DeleteConfirmationPopupComponent} from './components/delete-confirmation-popup/delete-confirmation-popup.component';
import {EditAvailabilityPopupComponent} from "./components/edit-availability-popup/edit-availability-popup.component";
import {Router} from "@angular/router";


@Component({
  selector: 'app-test-control-page',
  templateUrl: './test-control-page.component.html',
  styleUrls: ['./test-control-page.component.css']
})
export class TestControlPageComponent implements OnInit {

  public knowledgeControlTests: TestAvailable[] = [];
  public selfControlTests: TestAvailable[] = [];
  public nNTests: TestAvailable[] = [];
  public beforeEUMKTests: TestAvailable[] = [];
  public forEUMKTests: TestAvailable[] = [];
  public loading: boolean;
  public allTests: TestAvailable[];


  constructor(private testService: TestService,
              private router: Router,
              public dialog: MatDialog) {
  }

  ngOnInit() {
    this.getTests('1');
  }

  private getTests(subjectId): void {
    this.testService.getTestAllTestBySubjectId(subjectId).subscribe((tests) => {
      this.allTests = tests;
      this.sortTests(tests);
    });
  }

  openDialog(event?: any): void {
    const dialogRef = this.dialog.open(EditTestPopupComponent, {
      width: '700px',
      data: {event}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }

  public openAvailabilityDialog(event?: any): void {
    const dialogRef = this.dialog.open(EditAvailabilityPopupComponent, {
      width: '700px',
      data: {event}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }

  public openConfirmationDialog(event: any): void {
    const dialogRef = this.dialog.open(DeleteConfirmationPopupComponent, {
      width: '500px',
      data: {event}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteTest(event);
      }
    });
  }

  public deleteTest(testId): void {
    this.testService.deleteTest(testId).subscribe(() => {
      this.getTests('1');
    });
  }

  public filterTests(searchValue: string): void {
    const filteredTests = this.allTests.filter((test) => {
      return test.Title.includes(searchValue);
    });
    this.sortTests(filteredTests);
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

  public navigateToQuestions(event): void {
    this.router.navigate(['/questions/' + event]);
  }
}
