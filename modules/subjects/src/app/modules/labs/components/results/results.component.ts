import {Component, Input, OnInit} from '@angular/core';
import {Group} from "../../../../models/group.model";
import {LabsService} from "../../../../services/labs/labs.service";
import {select, Store} from '@ngrx/store';
import {getSubjectId} from '../../../../store/selectors/subject.selector';
import {IAppState} from '../../../../store/state/app.state';
import {getCurrentGroup} from '../../../../store/selectors/groups.selectors';
import {DialogData} from '../../../../models/dialog-data.model';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ComponentType} from '@angular/cdk/typings/portal';
import {LabsMarkPopoverComponent} from './labs-mark-popover/labs-mark-popover.component';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.less']
})
export class ResultsComponent implements OnInit {

  @Input() teacher: boolean;

  public numberSubGroups: number[] = [1, 2];
  public displayedColumns: string[] = ['position', 'name'];

  public selectedGroup: Group;
  private subjectId: string;
  private student: any[];
  header: any[];

  constructor(private labService: LabsService,
              private store: Store<IAppState>,
              public dialog: MatDialog) { }

  ngOnInit() {
    this.store.pipe(select(getSubjectId)).subscribe(subjectId => {
      this.subjectId = subjectId;

      this.store.pipe(select(getCurrentGroup)).subscribe(group => {
        this.selectedGroup = group;

        this.refreshStudents();
      });
    });
  }

  refreshStudents() {
    this.labService.getMarks(this.subjectId, this.selectedGroup.groupId).subscribe(res => {
      this.student = res;
      this._getHeader(res[0].Marks.length);
    })
  }
  _getStudentGroup(i: number) {
    return this.student.filter(res => res.SubGroup === i);
  }

  _getHeader(length: number) {
    this.header = [];
    let i = 1;
    while (length >= i) {
      this.header.push({head: this._getRandom(), text: 'ЛР' + i});
      i++
    }
    this.header.push({head: this._getRandom(), text: 'Средний балл'});
    this.header.push({head: this._getRandom(), text: 'Средний балл за тест'});
    this.header.push({head: this._getRandom(), text: 'Рейтинговая оценка'});
    return this.header;
  }

  _getSubGroupDisplayColumns(i: number) {
    return [...this.displayedColumns, ...this.header.map(res => res.head)];
  }

  _getRandom() {
      return Math.floor(Math.random() * Math.floor(1000)).toString();
  }

  _getMark(student, i): number {
    return [...student.Marks.map(res => res.Mark), student.LabsMarkTotal, student.TestMark,  ((Number(student.LabsMarkTotal) + Number(student.TestMark))/2)][i];
  }

  setMark(student, i) {
    console.log(student)
    if (i < student.Marks.length) {
      const labsMark = {
        id: student.Marks[i].StudentLabMarkId ? student.Marks[i].StudentLabMarkId : '0',
        comment: student.Marks[i].Comment,
        mark: student.Marks[i].Mark,
        date: student.Marks[i].Date,
        labId: student.Marks[i].LabId.toString(),
        studentId: student.StudentId.toString(),
        students: this.student
      };
      const dialogData: DialogData = {
        title: 'Выставление отметки',
        buttonText: 'Сохранить',
        body: labsMark
      };
      const dialogRef = this.openDialog(dialogData, LabsMarkPopoverComponent);

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.labService.setLabsMark(labsMark)
            .subscribe(res => res.Code === '200' && this.refreshStudents());
        }
      });
    }
  }

  openDialog(data: DialogData, popover: ComponentType<any>): MatDialogRef<any> {
    return this.dialog.open(popover, {data});
  }
}
