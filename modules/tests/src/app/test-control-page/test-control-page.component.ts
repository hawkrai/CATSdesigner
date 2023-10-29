import { ChangeDetectorRef, Component, OnInit } from '@angular/core'
import { MatDialog, MatSnackBar } from '@angular/material'
import { Router } from '@angular/router'
import { TranslatePipe } from 'educats-translate'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

import { AutoUnsubscribeBase } from '../core/auto-unsubscribe-base'
import { AutoUnsubscribe } from '../decorator/auto-unsubscribe'
import { Group } from '../models/group.model'
import { Test } from '../models/test.model'
import { TestService } from '../service/test.service'
import { AppToastrService } from '../service/toastr.service'
import { DeleteConfirmationPopupComponent } from './components/delete-confirmation-popup/delete-confirmation-popup.component'
import { EditAvailabilityPopupComponent } from './components/edit-availability-popup/edit-availability-popup.component'
import { EditTestPopupComponent } from './components/edit-test-popup/edit-test-popup.component'

@AutoUnsubscribe
@Component({
  selector: 'app-test-control-page',
  templateUrl: './test-control-page.component.html',
  styleUrls: ['./test-control-page.component.less'],
})
export class TestControlPageComponent
  extends AutoUnsubscribeBase
  implements OnInit
{
  public knowledgeControlTests: Test[] = []
  public selfControlTests: Test[] = []
  public nNTests: Test[] = []
  public beforeEUMKTests: Test[] = []
  public forEUMKTests: Test[] = []
  public loading: boolean
  public allowChanges: boolean = true
  public allTests: Test[]
  public filterStudentsString: string = ''
  public inputValue: string = ''
  public filterCompletingString: string = ''
  //todo any delete
  public user: any
  public subject: any
  public allowDropdown: boolean
  public adminTests: boolean = true
  public groups: Group[]
  public groupId: number
  public currentTabIndex: number = 0
  public knowledgeControlTestsSize: number
  private unsubscribeStream$: Subject<void> = new Subject<void>()
  private filterTestsString: string = ''
  public white: boolean
  public black: boolean

  constructor(
    private testService: TestService,
    private router: Router,
    private translatePipe: TranslatePipe,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    public dialog: MatDialog,
    private toastr: AppToastrService
  ) {
    super()
  }

  ngOnInit() {
    this.currentTabIndex = Number(localStorage.getItem('testsModule_tab')) || 0

    if (localStorage.getItem('theme') === 'white') {
      this.white = true
    } else {
      this.black = true
    }
    this.user = JSON.parse(localStorage.getItem('currentUser'))
    this.subject = JSON.parse(localStorage.getItem('currentSubject'))
    this.getTests(this.subject.id)
  }

  openDialog(event?: any): void {
    const dialogRef = this.dialog.open(EditTestPopupComponent, {
      data: { event },
      panelClass: 'test-modal-container',
      autoFocus: false,
    })

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.unsubscribeStream$))
      .subscribe((result) => {
        this.getTests(this.subject.id)
        this.cdr.detectChanges()
      })
  }

  public openAvailabilityDialog(tests: any[], event?: any): void {
    let testsValue = tests.filter((a) => a.Id === event)
    if (event !== undefined) {
      testsValue = testsValue[0]
    }
    const dialogRef = this.dialog.open(EditAvailabilityPopupComponent, {
      width: '548px',
      data: { event, test: testsValue },
    })

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.unsubscribeStream$))
      .subscribe((result) => {
        this.getTests(this.subject.id)
        this.cdr.detectChanges()
      })
  }

  public openConfirmationDialog(event: any): void {
    const dialogRef = this.dialog.open(DeleteConfirmationPopupComponent, {
      width: '500px',
      data: { event },
      panelClass: 'test-modal-container',
    })

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.unsubscribeStream$))
      .subscribe((result) => {
        if (result) {
          this.deleteTest(event)
        }
      })
  }

  public deleteTest(testId): void {
    this.testService
      .deleteTest(testId)
      .pipe(takeUntil(this.unsubscribeStream$))
      .subscribe(
        () => {
          this.getTests(this.subject.id)
        },
        (error1) => {
          this.toastr.addErrorFlashMessage(
            this.translatePipe.transform(
              'text.test.error.delete.test',
              'Закройте, пожалуйста, доступ к тесту и повторите удаление '
            )
          )
        }
      )
  }

  public openSnackBar(message: string, action?: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    })
  }

  public filterTests(searchValue: string): void {
    if (this.currentTabIndex === 0) {
      this.filterTestsString = searchValue
      const filteredTests = this.allTests.filter((test) => {
        return test.Title.includes(searchValue)
      })
      this.sortTests(filteredTests)
    } else if (this.currentTabIndex === 1) {
      this.filterStudentsString = searchValue
    } else if (this.currentTabIndex === 2) {
      this.filterCompletingString = searchValue
    }
  }

  public onChange(event: any): void {
    localStorage.setItem('testsModule_tab', String(event.index))
    this.currentTabIndex = event.index
    switch (this.currentTabIndex) {
      case 0: {
        this.allowChanges = true
        this.allowDropdown = false
        this.adminTests = true
        this.inputValue = this.filterTestsString
        break
      }
      case 1: {
        this.allowChanges = true
        this.allowDropdown = true
        this.adminTests = false
        this.inputValue = this.filterStudentsString
        break
      }
      case 2: {
        this.allowChanges = false
        this.allowDropdown = false
        this.adminTests = false
        this.inputValue = this.filterCompletingString
        break
      }
    }
  }

  public groupValueChange(event): void {
    this.groupId = event
  }

  public navigateToQuestions(event): void {
    this.router.navigate(['/questions/' + event])
  }

  private getTests(subjectId): void {
    this.testService
      .getAllTestBySubjectId(subjectId)
      .pipe(takeUntil(this.unsubscribeStream$))
      .subscribe((tests) => {
        this.allTests = tests
        this.sortTests(tests)
        this.knowledgeControlTestsSize = this.knowledgeControlTests.length
      })
  }

  private sortTests(tests): void {
    this.loading = true
    this.knowledgeControlTests = []
    this.selfControlTests = []
    this.nNTests = []
    this.beforeEUMKTests = []
    this.forEUMKTests = []
    tests.forEach((test) => {
      if (test.ForSelfStudy) {
        this.selfControlTests.push(test)
      } else if (test.ForNN) {
        this.nNTests.push(test)
      } else if (test.BeforeEUMK) {
        this.beforeEUMKTests.push(test)
      } else if (test.ForEUMK) {
        this.forEUMKTests.push(test)
      } else {
        this.knowledgeControlTests.push(test)
      }
    })
    this.loading = false
  }
}
