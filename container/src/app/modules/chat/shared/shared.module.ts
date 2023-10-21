import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import {
  NgbTooltipModule,
  NgbDropdownModule,
  NgbAccordionModule,
} from '@ng-bootstrap/ng-bootstrap'
import { MatDialogModule } from '@angular/material/dialog'
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar'

import { TranslateModule } from '@ngx-translate/core'
import { FormsModule } from '@angular/forms'
import { MatIconModule } from '@angular/material/icon'
import { ClipboardModule } from 'ngx-clipboard'
import { ChatService } from './services/chatService'
import { DataService } from './services/dataService'
import { ContactService } from './services/contactService'
import { FileService } from './services/files.service'
import { MsgService } from './services/msgService'
import { SignalRService } from './services/signalRSerivce'

@NgModule({
  imports: [],
  providers: [
    ChatService,
    ContactService,
    DataService,
    FileService,
    MsgService,
    SignalRService,
  ],
})
export class SharedModule {}
