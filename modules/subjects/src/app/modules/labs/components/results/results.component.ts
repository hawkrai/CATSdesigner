import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Group} from "../../../../models/group.model";
import {LabService} from "../../../../services/lab.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.less']
})
export class ResultsComponent implements OnInit, OnChanges {

  @Input() selectedGroup: Group;

  public numberSubGroups: number[] = [1, 2];
  public displayedColumns: string[] = ['position', 'name'];

  private subjectId: string;
  private student: any[];
  header: any[];

  constructor(private labService: LabService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.subjectId = this.route.snapshot.params.subjectId;

    this.labService.getMarks(this.subjectId, this.selectedGroup.groupId).subscribe(res => {
      this.student = res;
      this._getHeader(res[0].Marks.length);
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedGroup && !changes.selectedGroup.firstChange) {
      this.labService.getMarks(this.subjectId, this.selectedGroup.groupId).subscribe(res => {
        this.student = res;
        this._getHeader(res[0].Marks.length);
      })
    }
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
}
