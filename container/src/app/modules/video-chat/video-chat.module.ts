import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatModule } from './../chat/chat.module';
import { VideoHandlerComponent } from './components/video-handler/video-handler.component';
import { AngularDraggableModule } from 'ngx-draggable-resize';


@NgModule({
  declarations: [VideoHandlerComponent],
  imports: [
CommonModule,
  ChatModule,
  AngularDraggableModule
  ],
  exports: [
    VideoHandlerComponent
  ]
})
export class VideoChatModule { }
