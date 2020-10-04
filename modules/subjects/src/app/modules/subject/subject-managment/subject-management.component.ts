import { Store } from '@ngrx/store';
import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {SubSink} from 'subsink';

import {DialogData} from '../../../models/dialog-data.model';
import {SubjectService} from '../../../services/subject.service';
import { SubjectForm } from 'src/app/models/subject-form.model';
import { IAppState } from 'src/app/store/state/app.state';
import * as subjectActions from '../../../store/actions/subject.actions';

interface Group {
  id: number,
  value: string
};

@Component({
  selector: 'app-news-popover',
  templateUrl: './subject-management.component.html',
  styleUrls: ['./subject-management.component.less']
})
export class SubjectManagementComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  isLoading = false;
  subject: SubjectForm;

  groupList: Group[] = [];
  selectedGroups: number[] = [];

  constructor(
    public dialogRef: MatDialogRef<SubjectManagementComponent>,
    public subjectService: SubjectService,
    private store: Store<IAppState>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.dialogRef.disableClose = true;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    if (this.data.model && this.data.model.subjectId) {
      this.subs.add(this.subjectService.editSubject(this.data.model.subjectId).subscribe(res => {
          this.subject = res;
          this.setGroupList();
        }
      ));

    } else {
      this.subjectService.getCreateModel().subscribe(res => {
        this.subject = res;
        this.setGroupList();
      })
    }
  }

  save(): void {
    
    this.subject.SelectedGroups = [...this.selectedGroups];
    this.store.dispatch(subjectActions.saveSubject({ subject: this.subject }));
    this.dialogRef.close(true);
  }

  private setGroupList(): void {
    this.groupList = this.subject.Groups.map(g => ({ id: +g.Value, value: g.Text }));
    // this.subject.Groups.forEach(res => {
    //   const group = {
    //     id: +res.Value,
    //     value: res.Text,
    //   };
    //   this.groupList.push(group);
    // });
    this.selectedGroups = this.subject.SelectedGroups ? [...this.subject.SelectedGroups] : [];
  }

  getSelectedValue(id) {
    return this.groupList.find(group => group.id === id).value;
  }


}
