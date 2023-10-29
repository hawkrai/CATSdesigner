import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core'
import { Router } from '@angular/router'
import { NavItem } from '../../../../../models/nav-item'

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.less'],
})
export class MenuItemComponent implements OnInit {
  @Input() items: NavItem[]
  @ViewChild('childMenu', { static: true }) public childMenu

  @Output()
  public onSelectConcept: EventEmitter<any> = new EventEmitter()

  constructor(public router: Router) {}

  ngOnInit() {}

  selectConcept(id) {
    this.onSelectConcept.emit(id)
  }
}
