import { Component, Inject } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { ContactService } from '@chat/shared/services/contactService'
import { Chat } from '@chat/shared/models/entities/chats.model'

@Component({
  selector: 'app-group-list',
  templateUrl: './groupList.component.html',
  styleUrls: ['./groupList.component.scss']
})
export class GroupListComponent {
  public users: Chat[]
  constructor(
    private contactService: ContactService,
    public dialogRef: MatDialogRef<GroupListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: number
  ) {}

  ngOnInit() {
    if (this.data) {
      this.users = this.contactService.contacts
        .getValue()
        .filter((x) => x.groupId == this.data)
    }
  }

  openChat(chat) {
    this.contactService.openChat(chat)
    this.onCloseClick()
  }

  onCloseClick(): void {
    this.dialogRef.close(false)
  }
}
