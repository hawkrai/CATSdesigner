import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { NgbDropdownModule, NgbAccordionModule, NgbModalModule, NgbCollapseModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { ChatsComponent } from './chats/chats.component';
import { GroupsComponent } from './groups/groups.component';
import { SettingsComponent } from './settings/settings.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialogModule } from '@angular/material/dialog';
import { UploadComponent } from './upload/upload.component';
import { DndDirective } from './upload/dnd.directive';
import { ProgressComponent } from './progress/progress.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  declarations: [DndDirective,ProgressComponent,UploadComponent, ChatsComponent,  GroupsComponent, SettingsComponent],
  imports: [    
    MatDialogModule,
    CarouselModule,
    CommonModule,
    NgbDropdownModule,
    NgbAccordionModule,
    PerfectScrollbarModule,
    NgbTooltipModule,
    NgbModalModule,
    NgbCollapseModule,
    TranslateModule
  ],
  exports: [UploadComponent, ChatsComponent,  GroupsComponent, SettingsComponent],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class TabsModule { }
