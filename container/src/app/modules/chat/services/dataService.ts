import { Injectable } from '@angular/core';
import { Chats } from '../tabs/chats/chats.model';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Message } from '../index/chat.model';
import { SubjectGroups } from '../tabs/groups/subject.groups.model';
import { MessageCto } from '../Dto/messageCto';
@Injectable({
    providedIn: 'root',
})
export class DataService {
    public chats: Chats[] = new Array<Chats>();
    public files: any[]=[];
    public groups: SubjectGroups[] = new Array<SubjectGroups>();
    public msg: Message[] = new Array<Message>();
    public isLoaded = false;
    public activChat: Chats;
    public isActivGroup:boolean;
    public user = JSON.parse(localStorage.getItem('currentUser'));
    public isLecturer:boolean;
    private fileUrl:string;
    constructor(private http: HttpClient) { }

    public load(): void {
        this.isLoaded = true;
        this.isLecturer=this.user.role=="lector";
        this.http.get<Chats[]>('catService/chat/GetAllChats?userId=' + this.user.id)
            .subscribe(chats => {
                        chats.forEach(x=>{
                            this.chats.push(x);
                        })
                        
                        console.log(this.chats)
            });

            this.http.get<SubjectGroups[]>('catService/chat/GetAllGroups?userId=' + this.user.id+"&role="+this.user.role)
            .subscribe(groups => {
                        groups.forEach(x=>{
                            this.groups.push(x);
                        })
                        
                        console.log(this.groups)
            });
        // this.http.get<Contacts[]>('https://localhost:44306/api/Chat/GetContacts?id=' + this.user.id+"&role="+this.user.role)
        //     .subscribe(contacts => {
        //         this.contacts.length=0;
        //         contacts.forEach(x=>
        //         this.contacts.push(x));
        //     });        
    }

    public LoadGroupMsg(chatId: number) {
        this.msg.length = 0;
        this.isActivGroup=true;
        this.activChat = new Chats();;
        this.groups.forEach(x => {
            if (x.id == chatId) {
                this.activChat.id=x.id;
                this.activChat.name=x.name;
                x.unread=0;
            }
            else
            {
                x.groups.forEach(y=>
                    {
                        if (y.id == chatId) {
                            this.activChat.id=y.id;
                            this.activChat.name=y.name;
                            y.unread=0;
                        }           
                    })
            }
        })

        this.http.get<Message[]>('catService/chat/GetGroupMsg?userId=' + this.user.id+'&chatId=' + chatId)
            .subscribe(msgs => {            
                msgs.forEach(x => {
                    this.msg.push(x)
                })
                console.log(this.msg);
            });

    }

    public LoadMsg(chatId: number) {
        this.msg.length = 0;
        this.isActivGroup=false;
        this.activChat = null;
        this.chats.forEach(x => {
            if (x.id == chatId) {
                this.activChat = x as Chats;
            }
        })

        this.http.get<Message[]>('catService/chat/GetChatMsg?userId=' + this.user.id+'&chatId=' + chatId)
            .subscribe(msgs => {            
                msgs.forEach(x => {
                    this.msg.push(x)
                })
                console.log(this.msg);
            });
    }

    public downloadFile(filename:string)
    {
        this.http.get('catService/file/Download?chatId='+this.activChat.id+'&file='+filename,{responseType: "blob"}).subscribe(
            blob => {
                const a = document.createElement('a')
                const objectUrl = URL.createObjectURL(blob)
                a.href = objectUrl
                a.download = filename;
                a.click();
                URL.revokeObjectURL(objectUrl);
              }
        );
    }

    public SendImg(formData: FormData)
    {
        this.http.post('catService/file/UploadFile',formData).subscribe(x=>{console.log(x)});
    }
}