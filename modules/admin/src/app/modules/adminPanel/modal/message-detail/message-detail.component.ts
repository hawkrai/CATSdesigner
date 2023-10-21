import { Component, OnInit, Inject } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'
import { MessageService } from 'src/app/service/message.service'
import { SendMessageComponent } from '../send-message/send-message.component'
import { MatDialog } from '@angular/material/dialog'

@Component({
  selector: 'app-message-detail',
  templateUrl: './message-detail.component.html',
  styleUrls: ['./message-detail.component.css'],
})
export class MessageDetailComponent implements OnInit {
  message
  isLoad = false
  constructor(
    public dialogRef: MatDialogRef<MessageDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private messageService: MessageService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadMessage(this.data.elementId)
  }

  loadMessage(messageId) {
    this.messageService.getMessage(messageId).subscribe((result) => {
      this.message = result.DisplayMessage
      this.isLoad = true
    })
  }

  sendMessage() {
    this.dialogRef.close()
    const dialogRef = this.dialog.open(SendMessageComponent, {
      data: { user: this.message.AthorName },
    })
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result)
      if (result) {
        location.reload()
      }
    })
  }
}
