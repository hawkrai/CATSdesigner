import { MatTable } from '@angular/material';
import { Observable } from 'rxjs';
import {ComponentType} from '@angular/cdk/typings/portal';
import {Store} from '@ngrx/store';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { Component, Input, OnInit, OnDestroy, ChangeDetectorRef, AfterViewChecked, ViewChild } from '@angular/core';

import {Lab} from "../../../../models/lab.model";
import {IAppState} from '../../../../store/state/app.state';
import {DialogData} from '../../../../models/dialog-data.model';
import {LabWorkPopoverComponent} from './lab-work-popover/lab-work-popover.component';
import {DeletePopoverComponent} from '../../../../shared/delete-popover/delete-popover.component';
import {Attachment} from '../../../../models/attachment.model';
import {FileDownloadPopoverComponent} from '../../../../shared/file-download-popover/file-download-popover.component';
import * as labsActions from '../../../../store/actions/labs.actions';
import * as labsSelectors from '../../../../store/selectors/labs.selectors';
import { SubSink } from 'subsink';
import { CreateEntity } from 'src/app/models/form/create-entity.model';

@Component({
  selector: 'app-labs-work',
  templateUrl: './labs-work.component.html',
  styleUrls: ['./labs-work.component.less']
})
export class LabsWorkComponent implements OnInit, OnDestroy, AfterViewChecked {

  @Input() teacher: boolean;
  @ViewChild('table', { static: false }) table: MatTable<Lab>;
  private subs = new SubSink();
  public displayedColumns: string[] = ['position', 'theme', 'shortName', 'clock'];
  public labs: Lab[] = [];
  private labsCopy: Lab[] = [];
  private prefix = 'ЛР';

  constructor(
    private store: Store<IAppState>,
    private dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.store.dispatch(labsActions.loadLabs());
    this.subs.add(this.store.select(labsSelectors.getLabs).subscribe(labs => {
      this.labs = labs;
      this.labsCopy = [...labs.map(l => ({ ...l }))];
    }));
    const column = this.teacher ? 'actions' : 'download';
    this.displayedColumns.push(column);
  }

  ngAfterViewChecked(): void {
    this.cdRef.detectChanges();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    const toSave = this.labs.filter(l => {
      const copy =  this.labsCopy.find(lc => l.labId === lc.labId);
      return l.order !== copy.order || l.shortName !== copy.shortName;
    }
    );
    if (toSave.length) {
      this.store.dispatch(labsActions.updateLabs({ labs: toSave }));
    }
    this.store.dispatch(labsActions.resetLabs());
  }

  constructorLab(lab?: Lab) {
    const newLab = this.getLab(lab);

    const dialogData: DialogData = {
      title: lab ? 'Редактирование лабораторную работу' : 'Добавление лабораторную работу',
      buttonText: 'Сохранить',
      model: newLab
    };
    const dialogRef = this.openDialog(dialogData, LabWorkPopoverComponent);

    this.subs.add(
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          result.attachments = JSON.stringify(result.attachments);
          this.store.dispatch(labsActions.createLab({ lab: result as CreateEntity }));
        }
      })
    );
  }

  deleteLab(lab: Lab) {
    const dialogData: DialogData = {
      title: 'Удаление лабораторной работы',
      body: 'лабораторную работу "' + lab.theme + '"',
      buttonText: 'Удалить'
    };
    const dialogRef = this.openDialog(dialogData, DeletePopoverComponent);

    this.subs.add(
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.store.dispatch(labsActions.deleteLab({ id: lab.labId }));
        }
      })
    );
  }

  openFilePopup(attachments: Attachment[]) {
    const dialogData: DialogData = {
      title: 'Файлы',
      buttonText: 'Скачать',
      body: JSON.parse(JSON.stringify(attachments))
    };
    const dialogRef = this.openDialog(dialogData, FileDownloadPopoverComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._filesDownload(result)
      }
    });
  }

  _filesDownload(attachments: any[]) {
    attachments.forEach(attachment => {
      if (attachment.isDownload) {
        setTimeout(() => {
          window.open('http://localhost:8080/api/Upload?fileName=' + attachment.pathName + '//' + attachment.fileName)
        }, 1000)

      }
    });
  }

  openDialog(data: DialogData, popover: ComponentType<any>): MatDialogRef<any> {
    return this.dialog.open(popover, {data});
  }

  drop(event: CdkDragDrop<Lab[]>): void {
    console.log(event.item.data);
    const prevIndex = this.labs.findIndex(l => l.labId === event.item.data.labId);
    if (prevIndex === event.currentIndex) {
      return;
    }
    this.labs[prevIndex].order = event.currentIndex + 1;
    this.labs[prevIndex].shortName = `${this.prefix}${this.labs[prevIndex].order}`;
    this.labs[event.currentIndex].order = prevIndex + 1;
    this.labs[event.currentIndex].shortName = `${this.prefix}${this.labs[event.currentIndex].order}`;
    moveItemInArray(this.labs, prevIndex, event.currentIndex);
    this.table.renderRows();
  }

  private getLab(lab?: Lab) {
    return {
      id: lab ? lab.labId : 0,
      theme: lab ? lab.theme : '',
      duration: lab ? lab.duration : '',
      order: lab ? lab.order : this.labs.length + 1,
      pathFile: lab ? lab.pathFile : '',
      attachments: lab ? lab.attachments : [],
      shortName: lab ? lab.shortName : ''
    };
  }

}
