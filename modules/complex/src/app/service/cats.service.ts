import { Injectable } from '@angular/core'
import { Message } from '../models/message.model'

export const enum CodeType {
  error = 'error',
  success = 'success',
  warning = 'warning',
}

type Body = {
  Message: string
  Type: CodeType
}

@Injectable({ providedIn: 'root' })
export class CatsService {
  public setupMessageCommunication(): void {
    window.addEventListener('message', this.receiveMessage, false)
  }

  private receiveMessage = (event: MessageEvent): void => {
    const message = event.data[0]

    if (!message) {
      return
    }
  }

  public sendMessage(message: Message): void {
    window.parent.postMessage(
      [{ channel: message.Type, value: message.Value }],
      '*'
    )
  }

  public showMessage(body: Body): void {
    const message = new Message(
      'Toast',
      JSON.stringify({
        text: body.Message,
        type: body.Type,
      })
    )
    this.sendMessage(message)
  }
}
