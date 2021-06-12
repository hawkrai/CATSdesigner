import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {PercentageResultsService} from '../../services/percentage-results.service';
import {Subscription} from 'rxjs';
import {StudentPercentageResults} from '../../models/student-percentage-results.model';
import {PercentageGraph} from '../../models/percentage-graph.model';
import {PercentageResult} from '../../models/percentage-result.model';
import {DiplomUser} from '../../models/diplom-user.model';
import {MatDialog, MatOptionSelectionChange, MatSnackBar} from '@angular/material';
import {EditPercentageDialogComponent} from './edit-percentage-dialog/edit-percentage-dialog.component';
import { CoreGroup } from 'src/app/models/core-group.model';

@Component({
  selector: 'app-percentage-results',
  templateUrl: './percentage-results.component.html',
  styleUrls: ['./percentage-results.component.less']
})
export class PercentageResultsComponent implements OnInit, OnChanges {
  @Input() diplomUser: DiplomUser;

  private COUNT = 1000;
  private PAGE = 1;

  private percentageResults: StudentPercentageResults[];
  private filteredPercentageResults: StudentPercentageResults[];
  private percentageGraphs: PercentageGraph[];
  private groups: String[]

  private percentageResultsSubscription: Subscription;

  private searchString = '';
  private sorting = 'Id';
  private direction = 'desc';
  private selectedGroup: String;
  public isLecturer = false

  constructor(private percentageResultsService: PercentageResultsService,
              public dialog: MatDialog,
              private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    if (this.diplomUser.IsSecretary == false) {
      this.isLecturer = true
    }
    this.retrievePercentageResults();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedGroup && !changes.selectedGroup.firstChange) {
      this.retrievePercentageResults();
    }
  }

  lecturerStatusChange(event) {
    this.isLecturer = event.checked;
    this.retrievePercentageResults();
  }

  retrievePercentageResults() {
    this.percentageResults = null;
    this.percentageResultsSubscription = this.percentageResultsService.getPercentageResults(
      'count=' + this.COUNT +
      '&page=' + this.PAGE +
      '&filter={"isSecretary":"' + !this.isLecturer + '","searchString":"' + this.searchString + '"}' +
      '&sorting[' + this.sorting + ']=' + this.direction
    )
      .subscribe(res => {
        if (this.diplomUser.IsStudent) {
          var group = res.Students.Items.filter(x => x.Id == this.diplomUser.UserId)[0].Group;
          var students = res.Students.Items.filter(x => x.Group == group)
          this.percentageResults = this.assignResults(students, res.PercentageGraphs);
        }
        else {
          this.percentageResults = this.assignResults(res.Students.Items, res.PercentageGraphs);
        }
        this.percentageGraphs = res.PercentageGraphs;
        this.filteredPercentageResults = this.percentageResults;
      });
  }

  onSearchChange(searchText: string) {
    this.searchString = searchText;
    this.updateStats();
  }

  _selectedGroup(event: MatOptionSelectionChange) {
    if (event.isUserInput) {
      this.selectedGroup = event.source.value
      this.filteredPercentageResults = this.percentageResults.filter(x => x.Group == event.source.value)
    }
  }

  updateStats() {
    if (this.percentageResultsSubscription) {
      this.percentageResultsSubscription.unsubscribe();
    }
    this.retrievePercentageResults();
  }

  public getDiplomUser() {
    return this.diplomUser;
  }

  assignResults(studentPercentageResults: StudentPercentageResults[], percentageGraphs: PercentageGraph[]): StudentPercentageResults[] {
   this.groups = studentPercentageResults.map(a => a.Group).filter((v, i, a) => a.indexOf(v) === i);
    for (const student of studentPercentageResults) {
      const results: PercentageResult[] = [];
      for (const percentageGraph of percentageGraphs) {
        const result = student.PercentageResults.find(pr => pr.PercentageGraphId === percentageGraph.Id);
        if (result != null) {
          if (result.Mark == null) {
            result.Mark = '-';
          }
          results.push(result);
        } else {
          // @ts-ignore
          const pr: PercentageResult = {StudentId: student.Id, PercentageGraphId: percentageGraph.Id, Mark: '-'};
          results.push(pr);
        }
      }
      student.PercentageResults = results;
      if (student.Mark == null) {
        student.Mark = '-';
      }
    }
    return studentPercentageResults;
  }

  setResult(pr: PercentageResult) {
    const dialogRef = this.dialog.open(EditPercentageDialogComponent, {
      autoFocus: false,
      width: '400px',
      data: {
        mark: pr.Mark !== '-' ? pr.Mark : null,
        min: 0,
        max: 100,
        regex: '^[0-9]*$',
        errorMsg: 'Введите число от 0 до 100',
        label: 'Результат процентовки',
        symbol: '%',
        comment: pr.Comment,
        showForStudent: pr.ShowForStudent,
        expected: this.percentageGraphs.find(pg => pg.Id === pr.PercentageGraphId).Percentage
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null && result.mark != null && !(result.mark === '' && pr.Id == null)) {
        if (pr.Id == null) {
          this.percentageResultsService.setPercentage(pr.StudentId, pr.PercentageGraphId, result.mark, result.comment, result.showForStudent)
            .subscribe(() => {
              this.ngOnInit();
              this.addFlashMessage('Процент успешно сохранен');
            });
        } else {
          this.percentageResultsService.editPercentage(pr.Id, pr.StudentId, pr.PercentageGraphId, result.mark, result.comment, result.showForStudent)
            .subscribe(() => {
              this.ngOnInit();
              this.addFlashMessage('Процент успешно изменен');
            });
        }
      }
    });
  }

  setMark(student: StudentPercentageResults) {
    const dialogRef = this.dialog.open(EditPercentageDialogComponent, {
      autoFocus: false,
      width: '400px',
      data: {
        mark: student.Mark !== '-' ? student.Mark : null,
        min: 1,
        max: 10,
        regex: '^[0-9]*$',
        errorMsg: 'Введите число от 1 до 10',
        label: 'Оценка',
        notEmpty: true,
        total: true,
        lecturer: student.LecturerName,
        date: student.MarkDate,
        comment: student.Comment,
        showForStudent: student.ShowForStudent
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null && result.mark != null && result.mark !== '') {
        const date = new Date(result.date);
        date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
        const dateString = (date.getDay() < 10 ? '0' : '') + date.getDay() + '.' + (date.getMonth() < 10 ? '0' : '') + date.getMonth() +
          '.' + date.getFullYear();
        this.percentageResultsService.setMark(student.AssignedDiplomProjectId, result.mark, student.Lecturer, result.comment, dateString, result.showForStudent)
          .subscribe(() => {
            this.ngOnInit();
            this.addFlashMessage('Оценка успешно сохранена');
          });
      }
    });
  }

  getExcelFile() {
    location.href = location.origin + '/api/DpStatistic?count=1000' + '&page=1&filter=' + '{"group":"' + this.selectedGroup + '"}';
  }

  addFlashMessage(msg: string) {
    this.snackBar.open(msg, null, {
      duration: 2000
    });
  }

}
