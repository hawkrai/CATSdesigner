import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core'
import { VisitStats } from '../../models/visit-stats.model'
import { VisitStatsService } from '../../services/visit-stats.service'
import { interval, of, Subscription } from 'rxjs'
import { catchError, filter, switchMap } from 'rxjs/operators'
import { Consultation } from '../../models/consultation.model'
import { ConsultationMark } from '../../models/consultation-mark.model'
import { CourseUser } from '../../models/course-user.model'
import { AddDateDialogComponent } from './add-date-dialog/add-date-dialog.component'
import { MatDialog, MatDialogRef } from '@angular/material'
import { select, Store } from '@ngrx/store'
import { getSubjectId } from '../../store/selectors/subject.selector'
import { IAppState } from '../../store/state/app.state'
import { VisitingPopoverComponent } from '../../shared/visiting-popover/visiting-popover.component'
import { CoreGroup } from 'src/app/models/core-group.model'
import { TranslatePipe } from 'educats-translate'
import { ToastrService } from 'ngx-toastr'

@Component({
  selector: 'app-visit-stats',
  templateUrl: './visit-stats.component.html',
  styleUrls: ['./visit-stats.component.less'],
})
export class VisitStatsComponent implements OnInit, OnChanges, OnDestroy {
  @Input() selectedGroup: CoreGroup
  @Input() courseUser: CourseUser

  private COUNT = 1000
  private PAGE = 1
  private readonly POLLING_INTERVAL = 5000

  private visitStatsSubscription: Subscription
  private storeSubscription: Subscription
  private pollingSubscription: Subscription

  private visitStatsList: VisitStats[]
  private consultations: Consultation[]

  private subjectId: string
  private searchString = ''

  private preSavedData: Consultation = null

  private addDateDialogRef: MatDialogRef<AddDateDialogComponent> | null = null
  private pollingPaused = false

  constructor(
    private visitStatsService: VisitStatsService,
    public dialog: MatDialog,
    private toastr: ToastrService,
    private translatePipe: TranslatePipe,
    private store: Store<IAppState>
  ) {}

  ngOnInit() {
    this.storeSubscription = this.store
      .pipe(select(getSubjectId))
      .subscribe((subjectId) => {
        this.subjectId = subjectId
        this.retrieveVisitStats()
      })
    this.startPolling()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedGroup && !changes.selectedGroup.firstChange) {
      this.retrieveVisitStats()
    }
  }

  ngOnDestroy() {
    if (this.storeSubscription) this.storeSubscription.unsubscribe()
    if (this.pollingSubscription) this.pollingSubscription.unsubscribe()
    if (this.visitStatsSubscription) this.visitStatsSubscription.unsubscribe()
  }

  public getCourseUser() {
    return this.courseUser
  }

  private requestVisitStats() {
    return this.visitStatsService.getVisitStats({
      count: this.COUNT,
      page: this.PAGE,
      filter:
        '{"groupId":' +
        this.selectedGroup.GroupId +
        ',"subjectId":' +
        this.subjectId +
        ',"searchString":"' +
        this.searchString +
        '"}',
    })
  }

  retrieveVisitStats() {
    if (this.visitStatsSubscription) {
      this.visitStatsSubscription.unsubscribe()
    }
    this.visitStatsList = null
    this.visitStatsSubscription = this.requestVisitStats().subscribe((res) => {
      this.visitStatsList = this.assignResults(
        res.Students.Items,
        res.Consultations
      )
      this.consultations = res.Consultations
      this.syncDialog()
    })
  }

  // Тихое обновление: без спиннера и без сброса списка
  refreshSilently() {
    if (!this.selectedGroup || !this.subjectId) return
    this.requestVisitStats()
      .pipe(catchError(() => of(null)))
      .subscribe((res) => this.applyVisitStats(res))
  }

  private startPolling() {
    this.pollingSubscription = interval(this.POLLING_INTERVAL)
      .pipe(
        filter(() => !this.pollingPaused),
        switchMap(() => {
          if (!this.selectedGroup || !this.subjectId) return of(null)
          return this.requestVisitStats().pipe(catchError(() => of(null)))
        })
      )
      .subscribe((res) => this.applyVisitStats(res))
  }

  private applyVisitStats(res: any) {
    if (!res || !res.Students) return

    const list = this.assignResults(res.Students.Items, res.Consultations)
    const changed =
      JSON.stringify(list) !== JSON.stringify(this.visitStatsList) ||
      JSON.stringify(res.Consultations) !== JSON.stringify(this.consultations)

    if (changed) {
      this.visitStatsList = list
      this.consultations = res.Consultations
    }
    this.syncDialog()
  }

  private syncDialog() {
    const dlg = this.addDateDialogRef && this.addDateDialogRef.componentInstance
    if (dlg && !dlg.isEditing) {
      dlg.setConsultations(this.consultations)
    }
  }

  onSearchChange(searchText: string) {
    this.searchString = searchText
    this.updateStats()
  }

  updateStats() {
    if (this.visitStatsSubscription) {
      this.visitStatsSubscription.unsubscribe()
    }
    this.retrieveVisitStats()
  }

  assignResults(
    visitStats: VisitStats[],
    consultations: Consultation[]
  ): VisitStats[] {
    for (const student of visitStats) {
      const results: ConsultationMark[] = []
      consultations.map((consultation) => {
        const result = student.CourseProjectConsultationMarks.find(
          (cm) => cm.ConsultationDateId === consultation.Id
        )
        if (result != null) {
          if (result.Mark != null) {
            result.Mark = result.Mark.trim()
          }
          results.push(result)
        } else {
          // @ts-ignore
          const cm: ConsultationMark = {
            StudentId: student.Id,
            ConsultationDateId: consultation.Id,
          }
          results.push(cm)
        }
      })
      student.CourseProjectConsultationMarks = results
    }
    return visitStats
  }

  setVisitMarks(consultationDateId: string) {
    const rawDate = this.consultations.find(
      (consultation) => consultation.Id === consultationDateId
    ).Day

    const [day, month, year] = rawDate.split('.')
    const date = new Date(Number(year), Number(month) - 1, Number(day))

    const visits = { date, students: [] }

    this.visitStatsList.forEach((stats) => {
      const mark = stats.CourseProjectConsultationMarks.find(
        (stat) => stat.ConsultationDateId === consultationDateId
      )

      const visit = {
        name: stats.Name,
        mark: mark.Mark,
        comment: mark.Comment,
        id: mark.Id,
        consultationDateId: mark.ConsultationDateId,
        studentId: mark.StudentId,
        date: date,
        isShow: mark.ShowForStudent,
      }

      visits.students.push(visit)
    })

    // Пока открыт диалог отметок, опрос не должен подменять список
    this.pollingPaused = true

    const dialogRef = this.dialog.open(VisitingPopoverComponent, {
      width: '538px',
      data: {
        title: this.translatePipe.transform(
          'text.course.visit.dialog.set.title',
          'Посещение консультации'
        ),
        buttonText: this.translatePipe.transform(
          'text.course.visit.dialog.set.action.save',
          'Сохранить'
        ),
        body: visits,
      },
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.processDialogResult(result, false)
      } else {
        this.pollingPaused = false
      }
    })
  }

  processDialogResult(result: any, hasChanges: boolean) {
    const visit = result.students.pop()
    if (!visit) {
      this.pollingPaused = false
      if (hasChanges) {
        this.retrieveVisitStats()
        this.addFlashMessage(
          this.translatePipe.transform(
            'text.course.visit.dialog.set.action.save.success',
            'Посещаемость успешно обновлена'
          )
        )
      }
      return
    }
    if (visit.id == null) {
      this.visitStatsService
        .setMark(
          visit.studentId,
          visit.consultationDateId,
          visit.mark,
          visit.comment,
          visit.isShow
        )
        .subscribe(
          () => {
            this.processDialogResult(result, true)
          },
          () => {
            this.pollingPaused = false
          }
        )

      return
    }

    const origin = this.visitStatsList
      .find((s) => s.Id === visit.studentId)
      .CourseProjectConsultationMarks.find((m) => m.Id === visit.id)

    const hasUpdate =
      origin.Mark !== visit.mark ||
      origin.Comment !== visit.comment ||
      origin.ShowForStudent !== visit.isShow

    if (hasUpdate) {
      this.visitStatsService
        .editMark(
          visit.id,
          visit.studentId,
          visit.consultationDateId,
          visit.mark,
          visit.comment,
          visit.isShow
        )
        .subscribe(
          () => {
            this.processDialogResult(result, true)
          },
          () => {
            this.pollingPaused = false
          }
        )
    } else {
      this.processDialogResult(result, hasChanges)
    }
  }

  addDate() {
    const dialogRef = this.dialog.open(AddDateDialogComponent, {
      width: '548px',
      data: {
        ...this.preSavedData,
        consultations: [...this.consultations],
        subjectId: this.subjectId,
        groupId: this.selectedGroup.GroupId,
        onChanged: () => this.refreshSilently(),
      },
    })
    this.addDateDialogRef = dialogRef

    dialogRef.afterClosed().subscribe((result) => {
      this.addDateDialogRef = null

      if (result != null && !result.isClose) {
        const date = new Date(result.date)
        date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
        this.visitStatsService
          .addDate(
            null,
            date.toISOString(),
            this.subjectId,
            this.selectedGroup.GroupId,
            result.start,
            result.end,
            result.audience,
            result.building,
            result.lecturerId
          )
          .subscribe(() => {
            this.retrieveVisitStats()
            this.addFlashMessage(
              this.translatePipe.transform(
                'text.course.visit.dialog.add.save.success',
                'Дата консультации успешно добавлена'
              )
            )
          })
      }
      if (result && result.isClose) {
        this.preSavedData = result
      }
    })
  }

  addFlashMessage(msg: string) {
    this.toastr.success(msg)
  }
}