import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { Store } from '@ngrx/store';
import * as filesActions from '../../../../../store/actions/files.actions';
import { UserLabFile } from 'src/app/models/user-lab-file.model';
import { Attachment } from 'src/app/models/file/attachment.model';
import { IAppState } from 'src/app/store/state/app.state';
import { LabPositionsService } from 'src/app/services/lab-positions.service';

@Component({
  selector: 'app-job-protection-content',
  templateUrl: './job-protection-content.component.html',
  styleUrls: ['./job-protection-content.component.less'],
})
export class JobProtectionContentComponent implements OnInit {
  @Input() labFiles: UserLabFile[] = [];
  @Input() actionsTemplate: TemplateRef<any>;

  public displayedColumns = ['lab', 'file', 'comments', 'date', 'action'];
  public receivedLabs: UserLabFile[] = [];

  constructor(private store: Store<IAppState>, private labPositionsService: LabPositionsService) {}

  ngOnInit(): void {
    this.filterReceivedLabs();
    this.storeLabPositions();
  }

  // Фильтруем работы, у которых IsReceived = true
  filterReceivedLabs(): void {
    this.receivedLabs = this.labFiles.filter((lab) => lab.IsReceived);
  }

  // Сохраняем номера лабораторных работ с IsReceived = true
storeLabPositions(): void {
  this.labPositionsService.labPositions = this.labFiles
    .map((lab) => (lab.IsReceived ? lab.Order : null)) // Используем lab.Order как номер
    .filter((labNumber) => labNumber !== null);

  console.log('Номера лабораторных работ с IsReceived = true:', this.labPositionsService.labPositions);
}


  // Загрузка файла
  downloadFile(attachment: Attachment): void {
    this.store.dispatch(
      filesActions.downloadFile({
        pathName: attachment.PathName,
        fileName: attachment.FileName,
      })
    );
  }
}
