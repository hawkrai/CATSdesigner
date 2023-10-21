import { Injectable } from '@angular/core'
import { Message } from '../models/message.model'

@Injectable({ providedIn: 'root' })
export class CatsMessageService {
  public sendMessage(message: Message): void {
    window.parent.postMessage(
      [{ channel: message.Type, value: message.Value }],
      '*'
    )
  }
}
