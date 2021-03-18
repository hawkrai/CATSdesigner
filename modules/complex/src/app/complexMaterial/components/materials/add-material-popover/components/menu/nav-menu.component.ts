import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { ComplexCascade } from "../../../../../../models/ComplexCascade";



@Component({
  selector: "app-menu-item",
  templateUrl: "./nav-menu.component.html",
  styleUrls: ["./nav-menu.component.less"]
})
export class MenuItemComponent implements OnInit {
  @Input() items: ComplexCascade[];
  @ViewChild("childMenu", { static: true }) public childMenu;

  @Output()
  public onSelectConcept: EventEmitter<any> = new EventEmitter();

  constructor(public router: Router) {
  }

  ngOnInit() {
  }

  selectConcept(id) {
    this.onSelectConcept.emit(id);
  }
}
