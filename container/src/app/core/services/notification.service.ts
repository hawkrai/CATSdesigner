import { Injectable } from "@angular/core";
import * as signalR from "@microsoft/signalr"
import { CoreService } from "./core.service";

@Injectable({ providedIn: 'root' })
export class NotificationService {
    private hubConnection: signalR.HubConnection;

    constructor(private coreService: CoreService) {}

    public connect = () => {
        if (this.hubConnection && this.hubConnection.state !== signalR.HubConnectionState.Disconnected) {
            return;
        }
        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl('/notificationSignalR')
            .withAutomaticReconnect()
            .build();


        this.hubConnection
            .start()
            .then(() => {
                this.onProtectionChanged();
            })
            .catch((err) => console.log('Error while starting connection: ' + err));

    }

    private onProtectionChanged = () => {
        this.hubConnection.on('ProtectionChanged', data => {
            this.coreService.sendMessage({ Type: 'Protection', Value: data });
        });
    }
}