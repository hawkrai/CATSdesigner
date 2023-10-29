import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core'
import { PercentageResultsService } from '../../services/percentage-results.service'
import { Subscription } from 'rxjs'
import { StudentPercentageResults } from '../../models/student-percentage-results.model'
import { PercentageGraph } from '../../models/percentage-graph.model'
import { PercentageResult } from '../../models/percentage-result.model'
import { CourseUser } from '../../models/course-user.model'
import { MatDialog } from '@angular/material'
import { EditPercentageDialogComponent } from './edit-percentage-dialog/edit-percentage-dialog.component'
import { select, Store } from '@ngrx/store'
import { getSubjectId } from '../../store/selectors/subject.selector'
import { IAppState } from '../../store/state/app.state'
import { CoreGroup } from 'src/app/models/core-group.model'
import { ToastrService } from 'ngx-toastr'
import { TranslatePipe } from 'educats-translate'

@Component({
  selector: 'app-percentage-results',
  templateUrl: './percentage-results.component.html',
  styleUrls: ['./percentage-results.component.less'],
})
export class PercentageResultsComponent implements OnInit, OnChanges {
  @Input() selectedGroup: CoreGroup
  @Input() courseUser: CourseUser
  @Input() studentGroup: string | null = null

  private COUNT = 1000
  private PAGE = 1

  private percentageResults: StudentPercentageResults[]
  private percentageGraphs: PercentageGraph[]

  private percentageResultsSubscription: Subscription

  private subjectId: string
  private searchString = ''

  constructor(
    private percentageResultsService: PercentageResultsService,
    public dialog: MatDialog,
    private toastr: ToastrService,
    private translatePipe: TranslatePipe,
    private store: Store<IAppState>
  ) {}

  ngOnInit() {
    this.store.pipe(select(getSubjectId)).subscribe((subjectId) => {
      this.subjectId = subjectId
      this.retrievePercentageResults()
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedGroup && !changes.selectedGroup.firstChange) {
      this.retrievePercentageResults()
    }
  }

  retrievePercentageResults() {
    this.percentageResults = null
    const groupId: string = this.studentGroup
      ? this.studentGroup
      : this.selectedGroup.GroupId
    this.percentageResultsSubscription = this.percentageResultsService
      .getPercentageResults({
        count: this.COUNT,
        page: this.PAGE,
        filter:
          '{"groupId":' +
          groupId +
          ',"subjectId":"' +
          this.subjectId +
          '",' +
          '"secretaryId":' +
          this.selectedGroup.GroupId +
          ',' +
          '"searchString":"' +
          this.searchString +
          '"}',
      })
      .subscribe((res) => {
        this.percentageResults = this.assignResults(
          res.Students.Items,
          res.PercentageGraphs
        )
        this.percentageGraphs = res.PercentageGraphs
      })
  }

  onSearchChange(searchText: string) {
    this.searchString = searchText
    this.updateStats()
  }

  updateStats() {
    if (this.percentageResultsSubscription) {
      this.percentageResultsSubscription.unsubscribe()
    }
    this.retrievePercentageResults()
  }

  public getCourseUser() {
    return this.courseUser
  }

  assignResults(
    studentPercentageResults: StudentPercentageResults[],
    percentageGraphs: PercentageGraph[]
  ): StudentPercentageResults[] {
    for (const student of studentPercentageResults) {
      const results: PercentageResult[] = []
      for (const percentageGraph of percentageGraphs) {
        const result = student.PercentageResults.find(
          (pr) => pr.PercentageGraphId === percentageGraph.Id
        )
        if (result != null) {
          if (result.Mark == null) {
            result.Mark = ''
          }
          results.push(result)
        } else {
          // @ts-ignore
          const pr: PercentageResult = {
            StudentId: student.Id,
            PercentageGraphId: percentageGraph.Id,
            Mark: '',
            stageName: percentageGraph.Name,
          }
          results.push(pr)
        }
      }
      student.PercentageResults = results
      if (student.Mark == null) {
        student.Mark = ''
      }
    }
    return studentPercentageResults
  }

  setResult(pr: PercentageResult, student: string, lecturer: string, date) {
    const dialogRef = this.dialog.open(EditPercentageDialogComponent, {
      width: '548px',
      data: {
        mark: pr.Mark !== '' ? pr.Mark : null,
        min: 0,
        max: 100,
        regex: '^[0-9]*$',
        errorMsg: this.translatePipe.transform(
          'text.course.percentage.result.result.error',
          'Введите число от 0 до 100'
        ),
        label: this.translatePipe.transform(
          'text.course.percentage.result.result.label',
          'Результат процентовки'
        ),
        symbol: '%',
        student,
        lecturer,
        total: false,
        comment: pr.Comment,
        showForStudent: pr.ShowForStudent,
        stageName: pr.stageName,
        expected: this.percentageGraphs.find(
          (pg) => pg.Id === pr.PercentageGraphId
        ).Percentage,
        additionalData: date,
      },
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (
        result != null &&
        result.mark != null &&
        !(result.mark === '' && pr.Id == null)
      ) {
        if (pr.Id == null) {
          this.percentageResultsService
            .setPercentage(
              pr.StudentId,
              pr.PercentageGraphId,
              result.mark,
              result.comment,
              result.showForStudent
            )
            .subscribe(() => {
              this.ngOnInit()
              this.addFlashMessage(
                this.translatePipe.transform(
                  'text.course.percentage.result.result.save.success',
                  'Процент успешно сохранен'
                )
              )
            })
        } else {
          this.percentageResultsService
            .editPercentage(
              pr.Id,
              pr.StudentId,
              pr.PercentageGraphId,
              result.mark,
              result.comment,
              result.showForStudent
            )
            .subscribe(() => {
              this.ngOnInit()
              this.addFlashMessage(
                this.translatePipe.transform(
                  'text.course.percentage.result.result.change.success',
                  'Процент успешно изменен'
                )
              )
            })
        }
      }
    })
  }

  setMark(student: StudentPercentageResults, lecturer: string) {
    const dialogRef = this.dialog.open(EditPercentageDialogComponent, {
      width: '548px',
      data: {
        mark: student.Mark !== '' ? student.Mark : null,
        min: 1,
        max: 10,
        regex: '^[0-9]*$',
        errorMsg: this.translatePipe.transform(
          'text.course.percentage.result.result.error.mark',
          'Введите число от 0 до 10'
        ),
        label: this.translatePipe.transform(
          'text.course.percentage.result.result.label.mark',
          'Оценка за курсовой проект'
        ),
        notEmpty: true,
        total: true,
        lecturer,
        student: student.Name,
        date: student.MarkDate,
        comment: student.Comment,
        showForStudent: student.ShowForStudent,
      },
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result != null && result.mark != null && result.mark !== '') {
        const date = new Date(result.date)
        date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
        const dateString =
          (date.getDay() < 10 ? '0' : '') +
          date.getDay() +
          '.' +
          (date.getMonth() < 10 ? '0' : '') +
          date.getMonth() +
          '.' +
          date.getFullYear()
        this.percentageResultsService
          .setMark(
            student.AssignedCourseProjectId,
            result.mark,
            student.Lecturer,
            result.comment,
            dateString,
            result.showForStudent
          )
          .subscribe(() => {
            this.ngOnInit()
            this.addFlashMessage(
              this.translatePipe.transform(
                'text.course.percentage.result.result.mark.save.success',
                'Оценка успешно сохранена'
              )
            )
          })
      }
    })
  }

  addFlashMessage(msg: string) {
    this.toastr.success(msg)
  }
}
