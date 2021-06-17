import { Component, Inject, Input, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ContactService } from '../../services/contactService';
import { Chat } from '../chats/chats.model';

@Component({
  selector: 'app-group-list',
  templateUrl: './groupList.component.html',
  styleUrls: ['./groupList.component.scss']
})
export class GroupListComponent {
  public users:Chat[];
  constructor(
    private contactService: ContactService,
    public dialogRef: MatDialogRef<GroupListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: number) {
  }
  
  ngOnInit() {
    if (this.data) {
      this.users=this.contactService.contacts.getValue().filter(x=>x.groupId==this.data);
  }
  }

  onCloseClick(): void {
    this.dialogRef.close(false);
  }


}
