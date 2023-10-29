import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core'
import { TestPassingService } from '../../service/test-passing.service'
import { Router } from '@angular/router'
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop'
import { MatTable } from '@angular/material'
import { TestService } from '../../service/test.service'
import { NewOrderModel } from '../../models/newOrder.model'
import { Test } from '../../models/test.model'
import { AutoUnsubscribe } from '../../decorator/auto-unsubscribe'
import { AutoUnsubscribeBase } from '../../core/auto-unsubscribe-base'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

@AutoUnsubscribe
@Component({
  selector: 'app-main-table-tests',
  templateUrl: './main-table-tests.component.html',
  styleUrls: ['./main-table-tests.component.less'],
})
export class MainTableTestsComponent
  extends AutoUnsubscribeBase
  implements OnInit, AfterViewChecked
{
  @Input()
  public title: string

  @Input()
  public allowChanges: boolean

  @Input()
  public tests: Test[]

  @Input() isAvailabilityShown = true

  @Output()
  public onOpenEditPopup: EventEmitter<any> = new EventEmitter()

  @Output()
  public onOpenAvailabilityPopup: EventEmitter<any> = new EventEmitter()

  @Output()
  public onDeleteTest: EventEmitter<string> = new EventEmitter()

  @Output()
  public onNavigateQuestions: EventEmitter<any> = new EventEmitter()

  public isDraggable = true
  public test: any

  displayedColumns: string[] = ['Id', 'Title', 'action']
  @ViewChild('table', { static: false })
  table: MatTable<any>
  private unsubscribeStream$: Subject<void> = new Subject<void>()
  public white: boolean
  public black: boolean

  constructor(
    private testPassingService: TestPassingService,
    private testService: TestService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {
    super()
  }

  ngOnInit() {
    if (localStorage.getItem('theme') === 'white') {
      this.white = true
    } else {
      this.black = true
    }

    const user = JSON.parse(localStorage.getItem('currentUser'))

    if (user.role === 'student') {
      this.isDraggable = false
    }
  }

  public navigateToTest(Id: number): void {
    this.router.navigate(['test/' + Id])
  }

  public openEditPopup(element, index: number): void {
    this.onOpenEditPopup.emit({ ...element, index })
  }

  public deleteTest(testId): void {
    this.onDeleteTest.emit(testId)
  }

  public openAvailabilityPopup(testId): void {
    this.onOpenAvailabilityPopup.emit(testId)
  }

  public navigateToQuestions(testId): void {
    this.onNavigateQuestions.emit(testId)
  }

  dropTable(event: CdkDragDrop<any>) {
    if (event.previousContainer === event.container) {
      let findedTest = this.tests.find((test) =>
        event.item.element.nativeElement.innerText.includes(test.Title)
      )
      let re = this.tests.indexOf(findedTest)
      moveItemInArray(event.container.data, re, event.currentIndex)
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      )
    }
    this.tests = event.container.data
    let newOrder: NewOrderModel = new NewOrderModel()
    newOrder.newOrder = {}
    for (let i = 0; i < this.tests.length; i++) {
      newOrder.newOrder[this.tests[i].Id] = i + 1
    }
    this.testService
      .changeTestOrder(newOrder)
      .pipe(takeUntil(this.unsubscribeStream$))
      .subscribe()
    this.table.renderRows()
  }

  public ngAfterViewChecked() {
    //todo always called. fix drag and drop
    this.cdr.detectChanges()
  }
}
