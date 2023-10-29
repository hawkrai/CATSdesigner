import { Component, Input, OnInit } from '@angular/core'
import { Percentage } from '../../../models/percentage.model'
import { PercentagesComponent } from '../percentages.component'
import { TranslatePipe } from 'educats-translate'

@Component({
  selector: 'app-percentages-list',
  templateUrl: './percentages-list.component.html',
  styleUrls: ['./percentages-list.component.less'],
})
export class PercentagesListComponent implements OnInit {
  @Input() percentages: Percentage[]
  @Input() isLecturerMode: boolean = false

  constructor(
    private percentagesComponent: PercentagesComponent,
    public translatePipe: TranslatePipe
  ) {}

  ngOnInit() {}

  isLecturer(): boolean {
    return this.percentagesComponent.getDiplomUser().IsLecturer
  }
}
