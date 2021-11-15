import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatModule } from './../chat/chat.module';
import { VideoHandlerComponent } from './components/video-handler/video-handler.component';



@NgModule({
  declarations: [VideoHandlerComponent],
  imports: [
  CommonModule,
  ChatModule
  ],
  exports: [
    VideoHandlerComponent,
  ]
})
export class VideoChatModule { }
