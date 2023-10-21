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
import { takeUntil } from 'rxjs/operators'
import { Subject } from 'rxjs'
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
  public timeoutId = null

  constructor(
    private testPassingService: TestPassingService,
    private cdr: ChangeDetectorRef
  ) {
    super()
  }

  async ngOnInit() {
    await this.refreshData()
  }

  public async getTestsResult() {
    const subject = JSON.parse(localStorage.getItem('currentSubject'))
    this.testPassingService
      .getControlItems(subject.id)
      .pipe(takeUntil(this.unsubscribeStream$))
      .subscribe((controlItems: ControlItems[]) => {
        this.controlItems = controlItems
        this.filterStudents(controlItems)
      })
    await this.testPassingService.getControlItems(subject.id)
  }

  public async refreshData() {
    console.log('refreshData')
    await this.getTestsResult()
    this.timeoutId = setTimeout(this.refreshData.bind(this), 3000)
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
    clearTimeout(this.timeoutId)
  }
}
