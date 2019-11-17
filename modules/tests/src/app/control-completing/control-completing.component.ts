import {Component, OnInit} from '@angular/core';
import {TestPassingService} from "../service/test-passing.service";
import {ControlItems} from "../models/control-items.model";


@Component({
  selector: 'app-control-completing',
  templateUrl: './control-completing.component.html',
  styleUrls: ['./control-completing.component.less']
})
export class ControlCompletingComponent implements OnInit {

  public controlItems: ControlItems[];

  constructor(private testPassingService: TestPassingService) {
  }

  ngOnInit() {
    this.testPassingService.getControlItems("3").subscribe((controlItems) => {
      this.controlItems = controlItems;
    })
  }

}
