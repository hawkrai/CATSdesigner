import { Injectable } from "@angular/core";
import { Message } from "../models/message.model";

@Injectable({ providedIn: 'root'})
export class CatsService {
    public setupMessageCommunication(): void {
        window.addEventListener("message", this.receiveMessage, false);          
    }
    
    private receiveMessage = (event: MessageEvent): void => {
        let message: any = event.data[0];
        if (!message) {
            return;
        }
      };

    public sendMessage(message: Message): void {
        window.parent.postMessage([{channel: message.Type, value: message.Value}], '*');
    }
    
    public showMessage(body): void {
        const message = new Message('Toast', JSON.stringify({ text: body.Message as string, type: body.Code === '200' ? 'success' : 'warning' }));
        this.sendMessage(message);
    }
}