import { Injectable } from '@angular/core'
import { DataService } from '@chat/shared/services/dataService'
import { SignalRService } from '@chat/shared/services/signalRSerivce'
import { MessageCto } from '@chat/shared/models/dto/messageCto'
import { FileApiService } from '@chat/shared/api/file-api.service'

@Injectable({ providedIn: 'root' })
export class FileService {
  public user: any

  constructor(
    private dataService: DataService,
    private signalRService: SignalRService,
    private fileApiService: FileApiService
  ) {
    this.user = JSON.parse(localStorage.getItem('currentUser'))
  }

  public UploadFile(files: File[]) {
    const k = 1024
    const dm = 2
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    const formData = new FormData()
    for (var item of files) {
      var i = Math.floor(Math.log(item.size) / Math.log(k))
      var msg = new MessageCto()
      msg.userId = this.user.id
      msg.chatId = this.dataService.activChatId
      msg.fileSize =
        parseFloat((item.size / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
      msg.fileContent = item.name
      if (item.name.includes('.jpg') || item.name.includes('.png')) {
        msg.isimage = true
      } else msg.isfile = true
      formData.append(item.name, item)
    }
    formData.append('ChatId', this.dataService.activChatId.toString())
    this.dataService.SendImg(formData).subscribe((result) => {
      if (this.dataService.isGroupChat)
        this.signalRService.sendGroupMessage(msg)
      else this.signalRService.sendMessage(msg)
    })
  }

  public DownloadFile(filename: string) {
    this.fileApiService
      .downloadFile(this.dataService.activChatId, filename)
      .subscribe((blob) => {
        const a = document.createElement('a')
        const objectUrl = URL.createObjectURL(blob)
        a.href = objectUrl
        a.download = filename
        a.click()
        URL.revokeObjectURL(objectUrl)
      })
  }
}
