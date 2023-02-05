import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-admin-generate',
  providers: [Location, {provide: LocationStrategy, useClass: PathLocationStrategy}],
  templateUrl: './admin-generate.component.html'
})
export class AdminGenerateComponent implements OnInit {

  selectedTab = 0;

  constructor(
    private route: ActivatedRoute, 
    private router: Router, 
    private location: Location
    ) { }

  ngOnInit() {
    this.selectedTab = this.route.snapshot.firstChild.params.tab;
  }

  onSelectedTabChange(ev: MatTabChangeEvent) {
    const urlTree = this.router.createUrlTree(["main", ev.index], {
      relativeTo: this.route
    });

    this.location.replaceState(urlTree.toString());
  }

}
