import {Component, OnDestroy, OnInit} from '@angular/core';
import {TestPassingService} from "../service/test-passing.service";
import {ControlItems} from "../models/control-items.model";
import {takeUntil} from "rxjs/operators";
import {Subject} from "rxjs";


@Component({
  selector: 'app-control-completing',
  templateUrl: './control-completing.component.html',
  styleUrls: ['./control-completing.component.less']
})
export class ControlCompletingComponent implements OnInit, OnDestroy {

  private unsubscribeStream$: Subject<void> = new Subject<void>();
  public controlItems: ControlItems[];
  constructor(private testPassingService: TestPassingService) {
  }

  async ngOnInit() {
    for (let i = 0; i < 100; i++) {
      this.testPassingService.getControlItems("3")
        .pipe(takeUntil(this.unsubscribeStream$))
        .subscribe(controlItems => {
          this.controlItems = controlItems;
        });
      await this.testPassingService.getControlItems("3")
        .toPromise()
        .then(controlItems => {
          this.controlItems = controlItems;
        });
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeStream$.next();
    this.unsubscribeStream$.complete();
  }

}
