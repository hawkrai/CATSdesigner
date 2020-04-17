import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {TestPassingService} from "../service/test-passing.service";
import {ControlItems} from "../models/control-items.model";
import {takeUntil, tap} from "rxjs/operators";
import {Subject} from "rxjs";
import {AutoUnsubscribe} from "../decorator/auto-unsubscribe";
import {AutoUnsubscribeBase} from "../core/auto-unsubscribe-base";
import {Student} from "../models/student.model";


@AutoUnsubscribe
@Component({
  selector: 'app-control-completing',
  templateUrl: './control-completing.component.html',
  styleUrls: ['./control-completing.component.less']
})
export class ControlCompletingComponent extends AutoUnsubscribeBase implements OnInit, OnChanges {

  public controlItems: ControlItems[];
  public filteredControlItems: ControlItems[];
  @Input()
  public filterCompletingString: string;
  private unsubscribeStream$: Subject<void> = new Subject<void>();

  constructor(private testPassingService: TestPassingService) {
    super();
  }

  async ngOnInit() {
    for (let i = 0; i < 100; i++) {
      this.testPassingService.getControlItems("3")
        .pipe(takeUntil(this.unsubscribeStream$))
        .subscribe((controlItems: ControlItems[]) => {
          this.controlItems = controlItems;
          this.filterStudents(controlItems);
        });
      await this.testPassingService.getControlItems("3");
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    this.filterStudents(this.controlItems);
  }

  private filterStudents(controlItems: ControlItems[]): void {
    /*controlItems && controlItems.forEach((controlItem: ControlItems) =>{
      this.filteredControlItems.push(controlItem);
      this.filteredControlItems = controlItem && controlItem.Students.filter((student: Student) =>
        student.StudentName.includes(this.filterCompletingString)
      )};
    );*/
    console.log(controlItems);
  }
}
