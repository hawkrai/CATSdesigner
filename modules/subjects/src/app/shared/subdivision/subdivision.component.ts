import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DialogData} from '../../models/dialog-data.model';
import {SubjectService} from '../../services/subject.service';
import {select, Store} from '@ngrx/store';
import {getSubjectId} from '../../store/selectors/subject.selector';
import {IAppState} from '../../store/state/app.state';
import {MatOptionSelectionChange} from '@angular/material/core';
import {MatSelectionList} from '@angular/material/list';
import { Help } from 'src/app/models/help.model';
import { TranslatePipe } from 'educats-translate';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-subdivision',
  templateUrl: './subdivision.component.html',
  styleUrls: ['./subdivision.component.less']
})
export class SubdivisionComponent implements OnInit {

  public groups;
  public subjectId;
  public selectedGroup;
  public studentList = [];

  public allCheckbox = false;

  public subgroups = [1, 2, 3];
  public selectedOptions: any[];

  selectedGroupsMap = new Map<number, any[]>();


  constructor(
    public dialogRef: MatDialogRef<SubdivisionComponent>,
    public subjectService: SubjectService,
    private store: Store<IAppState>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private translate: TranslatePipe) {
    this.dialogRef.disableClose = true;
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
      if (subGroupStudents.length && index === 2) {
        this.thirdSubGroupVisible = true;
      }
      subGroupStudents.forEach(students => {
        this.studentList.push({...students, subGroup: index + 1});
      })
    });
  }

  help: Help = {
    message: this.translate.transform ('text.help.settings','Выберите группу, отметьте нужных студентов и выберите подгруппу, в которую необходимо их отнести'),
    action: this.translate.transform ('button.understand','Понятно')
  };

  transferSelected(from: number, to: number): void {
    if (this.selectedGroupsMap.has(from)) {
      const selectedStudents = this.selectedGroupsMap.get(from);
      this.studentList = this.studentList.map(x => selectedStudents.some(s => s.Value === x.Value) ? { ...x, subGroup: to } : x);
      this.selectedGroupsMap.delete(from);
    }
  }

  thirdSubGroupVisible = false;

  triggerThirdSubGroupVisible(): void {
    this.thirdSubGroupVisible = !this.thirdSubGroupVisible;
    if (!this.thirdSubGroupVisible) {
      this.studentList = this.studentList.map(x => x.subGroup === 3 ? { ...x, subGroup: 1 } : x);
    }
  }

  drop(event: CdkDragDrop<any[]>, subGroup: number): void {
    const student = event.previousContainer.data[event.previousIndex]

    this.studentList = this.studentList.map(x => x.Value === student.Value ? { ...student, subGroup } : x);
  }

  selectStudent(subgroup: number, student: any): void {
    if (this.selectedGroupsMap.has(subgroup)) {
      const students = this.selectedGroupsMap.get(subgroup);
      const index = students.findIndex(x => x.Value === student.Value);
      const newStudents = index >= 0 ? students.slice(0, index).concat(students.slice(index + 1)) : [...students, student];
      this.selectedGroupsMap.set(subgroup, newStudents);
    } else {
      this.selectedGroupsMap.set(subgroup, [student]);
    }
  }

  isStudentSelected(subgroup: number, student: any): boolean {
    return this.selectedGroupsMap.has(subgroup) && this.selectedGroupsMap.get(subgroup).some(x => x.Value === student.Value);
  }
}
