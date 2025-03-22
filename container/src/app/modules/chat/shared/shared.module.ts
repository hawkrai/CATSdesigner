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
import { ChatService } from '@chat/shared/services/chatService'
import { DataService } from '@chat/shared/services/dataService'
import { ContactService } from '@chat/shared/services/contactService'
import { FileService } from '@chat/shared/services/files.service'
import { SignalRService } from '@chat/shared/services/signalRSerivce'

@NgModule({
  imports: [],
  providers: [
    ChatService,
    ContactService,
    DataService,
    FileService,
    SignalRService,
  ],
})
export class SharedModule {}
