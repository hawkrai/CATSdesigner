import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbTooltipModule, NgbDropdownModule, NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import {MatDialogModule} from '@angular/material/dialog';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { TabsModule } from './tabs/tabs.module';

import { ChatRoutingModule } from './chat-routing.module';

import { IndexComponent } from './index/index.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ClipboardModule } from 'ngx-clipboard';
@NgModule({
  declarations: [IndexComponent],
  imports: [
    ClipboardModule,
    MatIconModule,
    PerfectScrollbarModule,
    NgbAccordionModule,
    CommonModule,
    ChatRoutingModule,
    TabsModule,
    NgbTooltipModule,
    NgbDropdownModule,
    TranslateModule,
    FormsModule
  ]
})
export class ChatModule { }
