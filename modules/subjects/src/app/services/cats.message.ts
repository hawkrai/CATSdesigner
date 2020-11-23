import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class CatsMessageService {
    
    constructor(private router: Router) {
              
    }
    
    public setupMessageCommunication(): void {
        window.addEventListener("message", (event: MessageEvent) => this.receiveMessage(event), false);          
    }
    
    private receiveMessage(event): void {
        let message: any = event.data[0];
        if (!message) {
            return;
        }
        console.log(`New message - ${message.channel} , value - ${message.value}`);
        if (message.channel == "Route"){
            this.router.navigateByUrl(`/${message.value}`);
        }        
      };
}