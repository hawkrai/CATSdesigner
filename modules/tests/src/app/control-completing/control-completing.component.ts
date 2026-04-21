import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  OnDestroy,
} from '@angular/core'
import { TestPassingService } from '../service/test-passing.service'
import { ControlItems } from '../models/control-items.model'
import { switchMap, takeUntil } from 'rxjs/operators'
import { Subject, timer } from 'rxjs'
import { AutoUnsubscribe } from '../decorator/auto-unsubscribe'
import { AutoUnsubscribeBase } from '../core/auto-unsubscribe-base'
import { Student } from '../models/student.model'

@AutoUnsubscribe
@Component({
  selector: 'app-control-completing',
  templateUrl: './control-completing.component.html',
  styleUrls: ['./control-completing.component.less'],
})
export class ControlCompletingComponent
  extends AutoUnsubscribeBase
  implements OnInit, OnChanges, OnDestroy
{
  public controlItems: ControlItems[]
  public filteredControlItems: ControlItems[] = []
  @Input()
  public filterCompletingString: string
  private unsubscribeStream$: Subject<void> = new Subject<void>()

  constructor(
    private testPassingService: TestPassingService,
    private cdr: ChangeDetectorRef
  ) {
    super()
  }

  ngOnInit() {
    const subject = JSON.parse(localStorage.getItem('currentSubject'))
    const subjectId = subject?.id
    if (!subjectId) return

    timer(0, 3000)
      .pipe(
        switchMap(() => this.testPassingService.getControlItems(subjectId)),
        takeUntil(this.unsubscribeStream$)
      )
      .subscribe((controlItems: ControlItems[]) => {
        this.controlItems = controlItems
        this.filterStudents(controlItems)
      })
  }

  public ngOnChanges(changes: SimpleChanges): void {
    this.filterStudents(this.controlItems)
  }

  public filterStudents(controlItems: ControlItems[]): void {
    this.filteredControlItems = []
    controlItems &&
      controlItems.forEach((controlItem: ControlItems, index: number) => {
        this.filteredControlItems.push(controlItem)
        this.filteredControlItems[index].Students =
          controlItem &&
          controlItem.Students.filter((student: Student) =>
            student.StudentName.toLowerCase().includes(
              this.filterCompletingString
            )
          )
      })
    this.cdr.detectChanges()
  }

  public ngOnDestroy(): void {
    this.unsubscribeStream$.next()
    this.unsubscribeStream$.complete()
  }
}
