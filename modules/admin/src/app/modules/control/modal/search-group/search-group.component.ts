import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GroupService } from 'src/app/service/group.service';
import { Group } from 'src/app/model/group';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-group',
  templateUrl: './search-group.component.html',
  styleUrls: ['./search-group.component.css']
})
export class SearchGroupComponent implements OnInit {

  groups: Group[];
  isLoad = false;

  constructor(
    private groupService: GroupService,
    public dialogRef: MatDialogRef<SearchGroupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router) { }

  ngOnInit(): void {
    this.loadGroup();
  }

  onClick(numb: string): void {
    if (numb) {
      this.groupIdByGroupName(numb);
    }
    this.dialogRef.close();
  }

  loadGroup() {
    this.groupService.getGroups().subscribe(items => {
      this.groups = items;
      this.isLoad = true;
    });
  }

  groupIdByGroupName(numb: string) {
    let groupId;
    let i;
    for (i = 0; i < this.groups.length; i++) {
      if (numb === this.groups[i].Name) {
        groupId = this.groups[i].Id;
      }
    }
    this.routeToControl(groupId);
  }

  routeToControl(groupId) {
    if (groupId) {
      this.router.navigate(['/control/statistic', groupId]);
    } else {
      this.router.navigate(['/control/groupNotFound']);
    }
  }

}
