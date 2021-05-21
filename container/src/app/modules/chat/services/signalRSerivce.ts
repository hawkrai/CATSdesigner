import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder} from '@aspnet/signalr';
import { Message } from '../index/chat.model';
import { DataService } from './dataService';
import { MessageCto } from '../Dto/messageCto';
@Injectable({
  providedIn: 'root'
})
export class SignalRService 
{
  private hubConnection: HubConnection
  public user = JSON.parse(localStorage.getItem('currentUser'));
  public dataService:DataService;   
  public startConnection(dataService:DataService) 
  {
    this.dataService=dataService;
    this.hubConnection = new HubConnectionBuilder()
                            .withUrl('http://178.124.197.115:3000/chat')
                            .withAutomaticReconnect()
                            .build();
    this.hubConnection
      .start()
      .then(() => 
        {
          console.log('server start signalR')
          this.join(this.user.id,this.user.role);
          this.addChatListener(); 
        })
      .catch(err => console.log('Error while starting connection: ' + err))    
  }

  public addChatListener()
  {
    this.hubConnection.on('GetMessage', (message:Message) => {
      if(message.chatId==this.dataService.activChat.id)  
        this.dataService.msg.push(message);
      else
      {
        this.dataService.groups.forEach(x => {
          if (x.id == message.chatId) {
              x.unread+=1;
          }
          else
          {
              x.groups.forEach(y=>
                  {
                    y.unread=y.unread+1;
                  })
          }
      })
       // this.dataService.groups[message.chatId].lastMessage=message.text;
      }
      console.log(message);
    });

    this.hubConnection.on('RemovedMessage',(chatId:any,msgId:any)=>
    {
      if (chatId==this.dataService.activChat.id.toString())
      {
        var msg=new Array<Message>();
        this.dataService.msg.forEach(x=>{
          if (x.id.toString()!=msgId)
            msg.push(x);
        })
        this.dataService.msg.length=0;
        msg.forEach(x=>{
          this.dataService.msg.push(x);
        })
        
      }
      console.log(msgId);
      console.log(chatId)
    }
    )
  }

  public sendMessage(msg:MessageCto)
  {
    this.hubConnection.invoke("SendMessage",this.user.id,JSON.stringify(msg))
  }

  public sendGroupMessage(msg:MessageCto)
  {
    this.hubConnection.invoke("SendGroupMessage",this.user.id,this.user.role,JSON.stringify(msg))
  }

  public SendGroupFiles()
  {
      const k = 1024;
      const dm = 2;
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
      const formData = new FormData();
      for(var item of this.dataService.files)
      {
          var i = Math.floor(Math.log(item.size) / Math.log(k));
          var msg=new MessageCto();
          msg.userId=this.user.id;
          msg.chatId=this.dataService.activChat.id;
          msg.fileSize=parseFloat((item.size / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
          msg.fileContent=item.name;
          if (item.name.includes(".jpg") || item.name.includes(".png"))
              {
                msg.isimage=true;
              }
          else
              msg.isfile=true;
          this.sendGroupMessage(msg);
          formData.append(item.name, item);  
      }
      formData.append("ChatId",this.dataService.activChat.id.toString()); 
      this.dataService.SendImg(formData);         
  }

  public remove(id:any)
  {
    return this.hubConnection.invoke("DeleteGroupMsg",id.toString(),this.dataService.activChat.id.toString());
  }

  public join(userId:number,role:string)
  {
    return this.hubConnection.invoke("Join",userId,role);
  }
}
