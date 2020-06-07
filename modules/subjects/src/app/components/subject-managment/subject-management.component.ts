import {Component, Inject, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DialogData} from '../../models/dialog-data.model';
import {FormControl} from '@angular/forms';
import {SubjectService} from '../../services/subject.service';
import {select, Store} from '@ngrx/store';
import {getSubjectId} from '../../store/selectors/subject.selector';
import {IAppState} from '../../store/state/app.state';

@Component({
  selector: 'app-news-popover',
  templateUrl: './subject-management.component.html',
  styleUrls: ['./subject-management.component.less']
})
export class SubjectManagementComponent implements OnInit {

  public abbreviation = '';
  public name = '';
  public color = '#a46161';
  groups = new FormControl();

  groupList = [];
  selectedGroup = {id: [], value: []};

  public subject;

  constructor(
    public dialogRef: MatDialogRef<SubjectManagementComponent>,
    public subjectService: SubjectService,
    private store: Store<IAppState>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }

  onClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.store.pipe(select(getSubjectId)).subscribe(subjectId => {
      this.subjectService.editSubject(subjectId).subscribe(res => {
          this.subject = res;

          this.setGroupList();
        }
      );
    });
  }

  save() {
    this.subject.SelectedGroups = [...this.selectedGroup.id];
    this.subjectService.saveSubject(this.subject).subscribe(res => console.log(res))
    this.dialogRef.close();
  }

  private setGroupList() {
    this.subject.Groups.forEach(res => {
      const group = {
        id: +res.Value,
        value: res.Text,
      };
      this.groupList.push(group);
    });
    this.selectedGroup.id = [...this.subject.SelectedGroups];
  }

  private getSelectedValue(id) {
    return this.groupList.find(group => group.id === id).value;
  }


}
