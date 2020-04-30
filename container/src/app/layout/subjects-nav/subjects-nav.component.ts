import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { LayoutService } from "../layout.service";

@Component({
  selector: 'app-subjects-nav',
  templateUrl: './subjects-nav.component.html',
  styleUrls: ['./subjects-nav.component.less']
})
export class SubjectsNavComponent implements OnInit {
  opened:boolean;

  constructor(private layouService: LayoutService) { }

  ngOnInit(): void {
    var that = this;
    this.layouService.sideNavToggleSubject.subscribe(() => {
      this.opened = !this.opened;
    });
  }

}
