import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core'
import { VisitStats } from '../../models/visit-stats.model'
import { VisitStatsService } from '../../services/visit-stats.service'
import { Subscription } from 'rxjs'
import { Consultation } from '../../models/consultation.model'
import { ConsultationMark } from '../../models/consultation-mark.model'
import { CourseUser } from '../../models/course-user.model'
import { AddDateDialogComponent } from './add-date-dialog/add-date-dialog.component'
import { MatDialog } from '@angular/material'
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
export class VisitStatsComponent implements OnInit, OnChanges {
  @Input() selectedGroup: CoreGroup
  @Input() courseUser: CourseUser

  private COUNT = 1000
  private PAGE = 1

  private visitStatsSubscription: Subscription

  private visitStatsList: VisitStats[]
  private consultations: Consultation[]

  private subjectId: string
  private searchString = ''

  private preSavedData: Consultation = null

  constructor(
    private visitStatsService: VisitStatsService,
    public dialog: MatDialog,
    private toastr: ToastrService,
    private translatePipe: TranslatePipe,
    private store: Store<IAppState>
  ) {}

  ngOnInit() {
    this.store.pipe(select(getSubjectId)).subscribe((subjectId) => {
      this.subjectId = subjectId
      this.retrieveVisitStats()
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedGroup && !changes.selectedGroup.firstChange) {
      this.retrieveVisitStats()
    }
  }

  public getCourseUser() {
    return this.courseUser
  }

  retrieveVisitStats() {
    this.visitStatsList = null
    this.visitStatsSubscription = this.visitStatsService
      .getVisitStats({
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
      .subscribe((res) => {
        this.visitStatsList = this.assignResults(
          res.Students.Items,
          res.Consultations
        )
        this.consultations = res.Consultations
      })
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
  ).Day;

  const [day, month, year] = rawDate.split('.');
  const date = new Date(Number(year), Number(month) - 1, Number(day));

  const visits = { date, students: [] };

  this.visitStatsList.forEach((stats) => {
    const mark = stats.CourseProjectConsultationMarks.find(
      (stat) => stat.ConsultationDateId === consultationDateId
    );

    const visit = {
      name: stats.Name,
      mark: mark.Mark,                     
      comment: mark.Comment,               
      id: mark.Id,                         
      consultationDateId: mark.ConsultationDateId,
      studentId: mark.StudentId,
      date: date,
      isShow: mark.ShowForStudent         
    };

    visits.students.push(visit);
  });

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
      body: visits
    }
  });

  dialogRef.afterClosed().subscribe((result) => {
    if (result) {
      this.processDialogResult(result, false);
    }
  });
}



  processDialogResult(result: any, hasChanges: boolean) {
  const visit = result.students.pop()
  if (!visit) {
    if (hasChanges) {
      this.ngOnInit()
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
      .subscribe(() => {
        this.processDialogResult(result, true)
      })

    return
  }

  const origin = this.visitStatsList
    .find((s) => s.Id === visit.studentId)
    .CourseProjectConsultationMarks
    .find((m) => m.Id === visit.id)

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
      .subscribe(() => {
        this.processDialogResult(result, true)
      })

  } else {
    this.processDialogResult(result, hasChanges)
  }
}


  addDate() {
    const dialogRef = this.dialog.open(AddDateDialogComponent, {
      width: '548px',
      data: {
        ...this.preSavedData,
        consultations: this.consultations,
        subjectId: this.subjectId,
        groupId: this.selectedGroup.GroupId,
      },
    })

    dialogRef.afterClosed().subscribe((result) => {
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
            this.ngOnInit()
            this.addFlashMessage(
              this.translatePipe.transform(
                'text.course.visit.dialog.add.save.success',
                'Дата консультации успешно добавлена'
              )
            )
          })
      }
      if (result.isClose) {
        this.preSavedData = result
      }
    })
  }

  addFlashMessage(msg: string) {
    this.toastr.success(msg)
  }
}
