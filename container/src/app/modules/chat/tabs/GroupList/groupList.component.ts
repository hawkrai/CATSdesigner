import { Component, Inject, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ContactService } from '../../shared/services/contactService';
import { Chat } from '../../shared/models/entities/chats.model';

@Component({
  selector: 'app-group-list',
  templateUrl: './groupList.component.html',
  styleUrls: ['./groupList.component.scss'],
  encapsulation: ViewEncapsulation.None
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

  openChat(chat)
  {
    this.contactService.openCaht(chat);
    this.onCloseClick();
  }

  onCloseClick(): void {
    this.dialogRef.close(false);
  }


}
