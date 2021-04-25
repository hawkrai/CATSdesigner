import { Message } from './../../../../../container/src/app/core/models/message';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class CatsMessageService {
    
    constructor(private router: Router) {
              
    }
    
    public setupMessageCommunication(): void {
        window.addEventListener("message", this.receiveMessage, false);          
    }
    
    private receiveMessage = (event: MessageEvent): void => {
        let message: any = event.data[0];
        if (!message) {
            return;
        }
        console.log(`New message - ${message.channel} , value - ${message.value}`);
        if (message.channel == "Route"){
            this.router.navigateByUrl(`/${message.value}`);
        }        
      };

    public sendMessage(message: Message): void {
        window.parent.postMessage([{channel: message.Type, value: message.Value}], '*');
    }
    
    
}