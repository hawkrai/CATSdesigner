import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbTooltipModule, NgbDropdownModule, NgbAccordionModule, NgbCollapseModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import {MatDialogModule} from '@angular/material/dialog';
import { PerfectScrollbarModule, PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { IndexComponent } from './tabs/index/index.component';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from '../../shared/shared.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { ChatsComponent } from './tabs/chats/chats.component';
import { GroupListComponent } from './tabs/GroupList/groupList.component';
import { GroupsComponent } from './tabs/groups/groups.component';
import { LoaderComponent } from './tabs/loader/loader.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ChatRoutingModule } from './chat-routing.module';
import { MatBadgeModule } from '@angular/material/badge';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  declarations: [IndexComponent,LoaderComponent, GroupListComponent, ChatsComponent, GroupsComponent],
  imports: [
    ChatRoutingModule,
    SharedModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatIconModule,
    MatBadgeModule,
    MatDialogModule,
    CarouselModule,
    CommonModule,
    NgbDropdownModule,
    NgbAccordionModule,
    PerfectScrollbarModule,
    NgbTooltipModule,
    NgbModalModule,
    NgbCollapseModule,
    FormsModule
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class ChatModule { }
