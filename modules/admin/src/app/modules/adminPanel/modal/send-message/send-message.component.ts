import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'
import { FileService } from 'src/app/service/file.service'
import { MessageService } from 'src/app/service/message.service'
import { Recipients } from 'src/app/model/message'
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms'

@Component({
  selector: 'app-send-message',
  templateUrl: './send-message.component.html',
  styleUrls: ['./send-message.component.css'],
})
export class SendMessageComponent implements OnInit {
  @Output() submitEM = new EventEmitter()

  constructor(
    private uploadService: FileService,
    private messageService: MessageService,
    public dialogRef: MatDialogRef<SendMessageComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  files: File[] = []
  userList
  selectedUsers: Recipients[] = []
  form: FormGroup
  selectable = true
  removable = true

  ngOnInit() {
    this.form = this.formBuilder.group({
      users: new FormControl(this.data.user),
      theme: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(30),
      ]),
      text: new FormControl('', [Validators.required, Validators.minLength(1)]),
    })
  }

  file() {
    this.sendData()
    this.dialogRef.close({ data: true })
  }

  searchRecipients(searchValue) {
    this.messageService.searchRecipients(searchValue).subscribe((result) => {
      this.userList = result
    })
  }

  displayFn(value) {
    let displayValue: string
    if (Array.isArray(value)) {
      value.forEach((user, index) => {
        if (index === 0) {
          displayValue = user.text
        } else {
          displayValue += ', ' + user.text
        }
      })
    } else {
      displayValue = value
    }
    return displayValue
  }

  optionClicked(event: Event, user) {
    event.stopPropagation()
    this.toggleSelection(user)
  }

  toggleSelection(user) {
    user.selected = !user.selected
    if (user.selected) {
      this.selectedUsers.push(user)
    } else {
      const i = this.selectedUsers.findIndex(
        (value) => value.text === user.text
      )
      this.selectedUsers.splice(i, 1)
    }
    this.form.controls.users.setValue(this.selectedUsers)
  }

  deleteUser(user) {
    const index = this.selectedUsers.indexOf(user)
    if (index >= 0) {
      this.selectedUsers.splice(index, 1)
    }
  }

  deleteAttachment(index) {
    this.files.splice(index, 1)
  }

  onFileChange(event) {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < event.target.files.length; i++) {
      this.files.push(event.target.files[i])
    }
  }

  submit() {
    if (this.form.valid) {
      this.submitEM.emit(this.form.value)
    }
  }

  sendData() {
    const controls = this.form.controls
    const users = this.selectedUsers.map((item) => item.value)
    console.log(users, this.files)
    this.messageService
      .saveMessage(controls.theme.value, controls.text.value, users, this.files)
      .subscribe(
        (result) => {
          console.log(result)
        },
        (error) => {
          console.log(error)
        }
      )
  }
}
