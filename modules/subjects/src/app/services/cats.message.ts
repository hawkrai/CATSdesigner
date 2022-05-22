import { Message } from './../../../../../container/src/app/core/models/message';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { IAppState } from '../store/state/app.state';
import { Store } from '@ngrx/store';
import * as protectionActions from '../store/actions/protection.actions';

@Injectable({ providedIn: 'root' })
export class CatsMessageService {
    
    constructor(private router: Router, private store: Store<IAppState>) {
              
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
        if (message.channel === 'Protection') {
            this.store.dispatch(protectionActions.protectionReceived(message.value));
        }
      };

    public sendMessage(message: Message): void {
        window.parent.postMessage([{channel: message.Type, value: message.Value}], '*');
    }
    
    
}