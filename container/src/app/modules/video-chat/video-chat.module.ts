import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatModule } from './../chat/chat.module';
import { VideoHandlerComponent } from './components/video-handler/video-handler.component';
import { AngularDraggableModule } from 'ngx-draggable-resize';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [VideoHandlerComponent],
  imports: [
CommonModule,
  ChatModule,
  AngularDraggableModule,
  MatIconModule,
  ],
  exports: [
    VideoHandlerComponent,
  ]
})
export class VideoChatModule { }
