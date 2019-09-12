import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { SearchGroupComponent } from '../modal/search-group/search-group.component';

@Component({
  selector: 'app-navbar-statistic',
  templateUrl: './navbar-statistic.component.html',
  styleUrls: ['./navbar-statistic.component.css']
})
export class NavbarStatisticComponent implements OnInit {

  groupName: string;
  constructor(private dialog: MatDialog) { }

  ngOnInit() {
  }

  openControlGroupDialog() {
    const dialogRef = this.dialog.open(SearchGroupComponent);
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.groupName = result;
    });
  }

}
