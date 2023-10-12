import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export class ModuleCommunicationService {
  constructor() {}

  public sendMessage(window: any, message: any): void {
    window.postMessage([{ channel: message.Type, value: message.Value }], '*')
  }

  public receiveMessage1(window: any, router: any): void {
    window.addEventListener(
      'message',
      (event: MessageEvent) => this.receiveMessage(event, router),
      false
    )
  }

  private receiveMessage(event, router): void {
    const message: any = event.data[0]
    if (message.channel == 'Route') {
      router.navigateByUrl(`/${message.value}`)
    }
  }
}
