import { Component, Inject, ViewChild } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { ContactService } from '@chat/shared/services/contactService'
import { DataService } from '@chat/shared/services/dataService'
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
    private dataService: DataService,
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
      next: (students) => {
        this.users = students.map((s) => this.mapStudentToChat(s))
        this.loadingStudents = false
      },
      error: (err) => {
        console.error('Error loading students list:', err)
        this.loadingStudents = false
      },
    })
  }

  openChat(chat) {
    this.dialogRef.close(chat)
  }

  onCloseClick(): void {
    this.dialogRef.close(false)
  }

  private mapStudentToChat(student: User): Chat {
    const chat = new Chat()

    chat.userId = student.userId
    chat.name = student.fullName
    chat.img = chat.profilePicture = student.profile
    chat.isOnline = student.isOnline

    const existing = this.dataService.chats
      .getValue()
      .find((c) => c.userId === student.userId)

    if (existing) {
      chat.id = existing.id
      chat.unread = existing.unread
      chat.lastMessage = existing.lastMessage
      chat.time = existing.time
    }

    return chat
  }
}
