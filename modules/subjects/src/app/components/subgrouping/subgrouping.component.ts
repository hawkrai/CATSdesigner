import {Component, Inject, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DialogData} from '../../models/dialog-data.model';
import {FormControl} from '@angular/forms';
import {SubjectService} from '../../services/subject.service';
import {select, Store} from '@ngrx/store';
import {getSubjectId} from '../../store/selectors/subject.selector';
import {IAppState} from '../../store/state/app.state';
import {MatOptionSelectionChange} from '@angular/material/core';
import {MatSelectionList} from '@angular/material/list';

@Component({
  selector: 'app-news-popover',
  templateUrl: './subgrouping.component.html',
  styleUrls: ['./subgrouping.component.less']
})
export class SubgroupingComponent implements OnInit {

  public groups;
  public subjectId;
  public selectedGroup;
  public studentList = [];

  public allCheckbox = false;

  public subgroups = [1, 2, 3];
  public selectedOptions: any[];

  constructor(
    public dialogRef: MatDialogRef<SubgroupingComponent>,
    public subjectService: SubjectService,
    private store: Store<IAppState>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }

  onClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.store.pipe(select(getSubjectId)).subscribe(subjectId => {
      this.subjectId = subjectId;
      this.subjectService.editGroups(subjectId).subscribe(res => {
        this.setData(res);
      });
    });
  }

  save() {
    const body = {
      subjectId: this.subjectId,
      groupId: this.selectedGroup,
      subGroupFirstIds: "",
      subGroupSecondIds: "",
      subGroupThirdIds: ""
    };
    this.studentList.forEach((student, index) => {
      if (student.subGroup === 1) {
        body.subGroupFirstIds += student.Value + ',';
      } else if (student.subGroup === 2) {
        body.subGroupSecondIds += student.Value + ',';
      } else if (student.subGroup === 3) {
        body.subGroupThirdIds += student.Value + ',';
      }
    });
    this.subjectService.saveSubGroup(body).subscribe(res => console.log(res));
    this.dialogRef.close();
  }

  _selectedGroup(event: MatOptionSelectionChange) {
    if (event.isUserInput && event.source.value !== this.selectedGroup) {
      this.subjectService.subGroupsChangeGroup(this.subjectId, event.source.value).subscribe(res => {
        this.setData(res);
      })
    }
  }

  selectedAll(event, students: MatSelectionList) {
    if (event.checked) {
      students.selectAll();
    } else {
      students.deselectAll();
    }
  }

  splitUp(event, students: MatSelectionList) {
    if (event.isUserInput && this.selectedOptions && this.selectedOptions.length) {
      const subGroup = event.source.value;
      this.studentList.map(student => {
        if (this.selectedOptions.includes(student.Value.toString())) {
          student.subGroup = subGroup;
        }
      });
      this.studentList.sort((a, b) => a.subGroup - b.subGroup);
      students.deselectAll();
      this.allCheckbox = false;
    }
  }

  private setData(data) {
    this.groups = data.GroupsList;
    this.selectedGroup = data.GroupId;
    this.setSubGroupId([[...data.SubGroupsFirstList, ...data.StudentGroupList], [...data.SubGroupsTwoList], [...data.SubGroupsThirdList]]);
  }

  private setSubGroupId(students) {
    this.studentList = [];
    students.forEach((subGroupStudents, index) => {
      subGroupStudents.forEach(students => {
        this.studentList.push({...students, subGroup: index + 1});
      })
    })
  }

}
