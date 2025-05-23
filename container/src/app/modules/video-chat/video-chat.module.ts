import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ChatModule } from '@chat/chat.module'
import { VideoHandlerComponent } from './components/video-handler/video-handler.component'
import { AngularDraggableModule } from 'ngx-draggable-resize'
import { MatIconModule } from '@angular/material/icon'
import { MatTooltipModule } from '@angular/material/tooltip'
import { StreamHandlerComponent } from './components/stream-handler/stream-handler.component'
import { SharedModule } from '@app/shared/shared.module'

@NgModule({
  declarations: [VideoHandlerComponent, StreamHandlerComponent],
  imports: [
    CommonModule,
    ChatModule,
    AngularDraggableModule,
    MatIconModule,
    MatTooltipModule,
    SharedModule,
  ],
  exports: [VideoHandlerComponent],
})
export class VideoChatModule {}
