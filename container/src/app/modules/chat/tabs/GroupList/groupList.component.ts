import { Component, Inject } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { ContactService } from '@chat/shared/services/contactService'
import { ChatApiService } from '@chat/shared/api/chat-api.service'
import { Chat } from '@chat/shared/models/entities/chats.model'
import { User } from '@chat/shared/models/dto/user'

@Component({
  selector: 'app-group-list',
  templateUrl: './groupList.component.html',
  styleUrls: ['./groupList.component.scss'],
})
export class GroupListComponent {
  public users: Chat[]
  public loadingStudents = true
  constructor(
    private contactService: ContactService,
    private chatApiService: ChatApiService,
    public dialogRef: MatDialogRef<GroupListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: number
  ) {}

  ngOnInit() {
    if (this.data) {
      this.loadStudents()
    }
  }

  loadStudents() {
    this.loadingStudents = true
    this.chatApiService.getStudentsByGroupId(this.data).subscribe({
      next: (students: User[]) => {
        this.users = students.map((student) => {
          const chat = new Chat()
          chat.userId = student.userId
          chat.name = student.fullName
          chat.profilePicture = student.profile
          chat.isOnline = student.isOnline
          chat.groupId = student.groupId
          return chat
        })
        this.loadingStudents = false
      },
      error: (error) => {
        console.error('Error loading students list:', error)
        this.loadingStudents = false
      },
    })
  }

  openChat(chat) {
    this.contactService.openChat(chat)
    this.onCloseClick()
  }

  onCloseClick(): void {
    this.dialogRef.close(false)
  }
}
