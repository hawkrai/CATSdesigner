import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AddGroupComponent } from '../modal/add-group/add-group.component';


export class Group {
  numb: number;
  yearEnd: string;
  yearBegin: string;
}

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {

  group = new Group();
  constructor(private dialog: MatDialog) { }

  ngOnInit() {
  }

  openDialog() {
    const dialogRef = this.dialog.open( AddGroupComponent, {
      data: {
       group: this.group
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.group = result;
    });
  }

}
