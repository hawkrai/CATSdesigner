import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DialogData} from '../../../models/dialog-data.model';
import {SubjectService} from '../../../services/subject.service';

@Component({
  selector: 'app-news-popover',
  templateUrl: './subject-management.component.html',
  styleUrls: ['./subject-management.component.less']
})
export class SubjectManagementComponent implements OnInit {

  groupList = [];
  selectedGroup = {id: [], value: []};

  public subject;

  constructor(
    public dialogRef: MatDialogRef<SubjectManagementComponent>,
    public subjectService: SubjectService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }

  onClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    if (this.data.model && this.data.model.subjectId) {
      this.subjectService.editSubject(this.data.model.subjectId).subscribe(res => {
          this.subject = res;
          this.setGroupList();
        }
      );
    } else {
      this.subjectService.getCreateModel().subscribe(res => {
        this.subject = res;
        this.setGroupList();
      })
    }
  }

  save() {
    this.subject.SelectedGroups = [...this.selectedGroup.id];
    this.subjectService.saveSubject(this.subject).subscribe(() => {});
    this.dialogRef.close(true)
  }

  private setGroupList() {
    this.subject.Groups.forEach(res => {
      const group = {
        id: +res.Value,
        value: res.Text,
      };
      this.groupList.push(group);
    });
    this.selectedGroup.id = this.subject.SelectedGroups ? [...this.subject.SelectedGroups] : [];
  }

  private getSelectedValue(id) {
    return this.groupList.find(group => group.id === id).value;
  }


}
