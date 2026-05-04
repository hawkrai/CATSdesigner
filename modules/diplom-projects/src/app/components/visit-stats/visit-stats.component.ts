import { Component, Input, OnInit } from '@angular/core'
import { VisitStats } from '../../models/visit-stats.model'
import { VisitStatsService } from '../../services/visit-stats.service'
import { Subscription } from 'rxjs'
import { Consultation } from '../../models/consultation.model'
import { ConsultationMark } from '../../models/consultation-mark.model'
import { DiplomUser } from '../../models/diplom-user.model'
import { AddDateDialogComponent } from './add-date-dialog/add-date-dialog.component'
import { MatDialog } from '@angular/material'
import { VisitingPopoverComponent } from '../../shared/visiting-popover/visiting-popover.component'
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component'
import { CoreGroup } from 'src/app/models/core-group.model'
import { Lecturer } from 'src/app/models/lecturer.model'
import { TranslatePipe } from 'educats-translate'
import { ToastrService } from 'ngx-toastr'
import { GroupService } from 'src/app/services/group.service'

@Component({
  selector: 'app-visit-stats',
  templateUrl: './visit-stats.component.html',
  styleUrls: ['./visit-stats.component.less'],
})
export class VisitStatsComponent implements OnInit {
  @Input() diplomUser: DiplomUser

  private COUNT = 1000
  private PAGE = 1

  private visitStatsSubscription: Subscription

  private visitStatsList: VisitStats[]
  public filteredVisitStatsList: VisitStats[]
  public consultations: Consultation[]
  public lecturers: Lecturer[]
  private index = 0
  public lecturer: Lecturer
  public isLecturer = false

  public groups: { id: number; name: string }[] = []
  public selectedGroup: { id: number; name: string } = null

  public themes = [
    {
      name: this.translatePipe.transform(
        'text.diplomProject.head',
        'Руководитель проекта'
      ),
      value: true,
    },
    {
      name: this.translatePipe.transform(
        'text.diplomProject.secretary',
        'Секретарь ГЭК'
      ),
      value: false,
    },
  ]
  public theme = undefined

  private preSavedData: Consultation = null
  public searchString = ''

  constructor(
    private visitStatsService: VisitStatsService,
    public dialog: MatDialog,
    private toastr: ToastrService,
    private groupService: GroupService,
    public translatePipe: TranslatePipe
  ) {}

  ngOnInit() {
    const toggleValue: string = localStorage.getItem('toggle')

    if (
      this.diplomUser.IsSecretary &&
      !this.diplomUser.IsLecturerHasGraduateStudents
    ) {
      this.isLecturer = false
      localStorage.removeItem('toggle')
    } else if (
      toggleValue &&
      this.diplomUser.IsLecturer &&
      this.diplomUser.IsSecretary
    ) {
      this.isLecturer =
        localStorage.getItem('toggle') === 'false' ? false : true
    } else {
      this.isLecturer = this.diplomUser.IsLecturer
    }

    this.theme = this.isLecturer ? this.themes[0] : this.themes[1]
    this.retrieveVisitStats()
  }

  onGroupChange(group: { id: number; name: string }) {
    this.selectedGroup = group
    this.retrieveVisitStats()
  }

  public getDiplomUser() {
    return this.diplomUser
  }

  retrieveVisitStats() {
  if (this.diplomUser.IsSecretary && !this.isLecturer) {
    this.visitStatsList = null

    this.visitStatsService
      .getLecturerDiplomGroups({
        entity: 'LecturerForSecretary',
        id: this.diplomUser.UserId,
      })
      .subscribe((res) => {
        this.lecturers = res.sort((a: any, b: any) =>
          a.Name < b.Name ? -1 : 1
        )

        if (this.groups.length === 0) {
          const groupRequests = this.lecturers.map((lecturer: any) =>
            this.visitStatsService
              .getVisitStats({
                count: this.COUNT,
                page: this.PAGE,
                filter:
                  '{"isSecretary":"' +
                  true +
                  '","lecturerId":"' +
                  lecturer.Id +
                  '","groupId":"0","searchString":""}',
              })
              .toPromise()
          )

          Promise.all(groupRequests).then((allResults: any[]) => {
            const seen = new Set<number>()
            const allGroups: { id: number; name: string }[] = []

            allResults.forEach((allRes: any) => {
              if (allRes && allRes.Students && allRes.Students.Items) {
                allRes.Students.Items.forEach((s: any) => {
                  if (s.GroupId && !seen.has(s.GroupId)) {
                    seen.add(s.GroupId)
                    allGroups.push({ id: s.GroupId, name: s.Group.trim() })
                  }
                })
              }
            })

            this.groups = allGroups.sort((a, b) => (a.name < b.name ? -1 : 1))

            if (this.groups.length > 0 && !this.selectedGroup) {
              this.selectedGroup = this.groups[0]
            }

            this.loadStudentsForAllLecturers()
          })
        } else {
          this.loadStudentsForAllLecturers()
        }
      })
  } else {
    this.visitStatsList = null
    this.visitStatsSubscription = this.visitStatsService
      .getVisitStats({
        count: this.COUNT,
        page: this.PAGE,
        filter:
          '{"isSecretary":"' +
          false +
          '","searchString":"' +
          this.searchString +
          '"}',
      })
      .subscribe((res) => {
        this.visitStatsList = this.assignResults(
          res.Students.Items,
          res.DiplomProjectConsultationDates
        )
        this.consultations = res.DiplomProjectConsultationDates
        this.filteredVisitStatsList = this.visitStatsList
      })
  }
}

  private loadStudentsForAllLecturers() {
  const groupId = this.selectedGroup ? this.selectedGroup.id : 0
  const requests = this.lecturers.map((lecturer: any) =>
    this.visitStatsService
      .getVisitStats({
        count: this.COUNT,
        page: this.PAGE,
        filter:
          '{"isSecretary":"' +
          true +
          '","lecturerId":"' +
          lecturer.Id +
          '","groupId":"' +
          groupId +
          '","searchString":"' +
          this.searchString +
          '"}',
      })
      .toPromise()
  )

  Promise.all(requests).then((results: any[]) => {
    const studentMap = new Map<any, VisitStats>()
    let allConsultations: Consultation[] = []
    const consultationIds = new Set<number>()

    results.forEach((res) => {
      if (res && res.Students && res.Students.Items) {
        res.Students.Items.forEach((s: VisitStats) => {
          if (!studentMap.has(s.Id)) {
            studentMap.set(s.Id, s)
          }
        })
      }
      if (res && res.DiplomProjectConsultationDates) {
        res.DiplomProjectConsultationDates.forEach((c: Consultation) => {
          if (!consultationIds.has(Number(c.Id))) {
            consultationIds.add(Number(c.Id))
            allConsultations.push(c)
          }
        })
      }
    })

    const allStudents = Array.from(studentMap.values())

    this.consultations = allConsultations
    this.visitStatsList = this.assignResults(allStudents, allConsultations)
    this.filteredVisitStatsList = this.visitStatsList
  })
}

  compareGroups(
    a: { id: number; name: string },
    b: { id: number; name: string }
  ): boolean {
    return a && b ? a.id === b.id : a === b
  }

  onSearchChange(searchText: string) {
    this.searchString = searchText
    this.updateStats()
  }

  lecturerStatusChange(event) {
    this.isLecturer = event.value.value
    this.selectedGroup = null
    this.groups = []
    localStorage.setItem('toggle', event.value.value)
    this.retrieveVisitStats()
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
    if (!visitStats || visitStats.length === 0) {
      return visitStats
    }

    for (const student of visitStats) {
      const results: ConsultationMark[] = []
      for (const consultation of consultations) {
        const result = student.DiplomProjectConsultationMarks.find(
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
      }
      student.DiplomProjectConsultationMarks = results
    }
    return visitStats
  }

  setVisitMarks(consultationDateId: string) {
    const date = new Date(
      this.consultations.find(
        (consultation) => consultation.Id === consultationDateId
      ).Day
    ).toLocaleDateString()
    const visits = { date, students: [] }
    this.visitStatsList.forEach((stats) => {
      const mark = stats.DiplomProjectConsultationMarks.find(
        (stat) => stat.ConsultationDateId === consultationDateId
      )
      const visit = {
        name: stats.Name,
        mark: mark.Mark,
        comments: mark.Comments,
        id: mark.Id,
        consultationDateId: mark.ConsultationDateId,
        studentId: mark.StudentId,
      }
      visits.students.push(visit)
    })

    const dialogRef = this.dialog.open(VisitingPopoverComponent, {
      autoFocus: false,
      width: '600px',
      height: '100%',
      data: {
        title: this.translatePipe.transform(
          'text.diplomProject.studentAttendance',
          'Посещение консультации'
        ),
        buttonText: this.translatePipe.transform('button.save', 'Сохранить'),
        body: visits,
      },
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.processDialogResult(result, false)
      }
    })
  }

  processDialogResult(result: any, hasChanges: boolean) {
    const visit = result.students.pop()
    if (visit != null) {
      if (visit.id == null) {
        if (visit.mark || visit.comment || visit.comment !== '') {
          hasChanges = true
          this.visitStatsService
            .setMark(
              visit.studentId,
              visit.consultationDateId,
              visit.mark,
              visit.comment,
              visit.showForStudent
            )
            .subscribe(() => this.processDialogResult(result, hasChanges))
        } else {
          this.processDialogResult(result, hasChanges)
        }
      } else {
        const origin = this.visitStatsList
          .find((stats) => stats.Id === visit.studentId)
          .DiplomProjectConsultationMarks.find((mark) => mark.Id === visit.id)
        if (origin.Mark !== visit.mark || origin.Comments !== visit.comment) {
          hasChanges = true
          this.visitStatsService
            .editMark(
              visit.id,
              visit.studentId,
              visit.consultationDateId,
              visit.mark,
              visit.comment,
              visit.showForStudent
            )
            .subscribe(() => this.processDialogResult(result, hasChanges))
        } else {
          this.processDialogResult(result, hasChanges)
        }
      }
    } else if (hasChanges) {
      this.ngOnInit()
      this.addFlashMessage(
        this.translatePipe.transform(
          'text.editor.edit.attendanceAlert',
          'Посещаемость успешно обновлена'
        )
      )
    }
  }

  addDate() {
  const dialogRef = this.dialog.open(AddDateDialogComponent, {
    autoFocus: false,
    width: '600px',
    height: '100%',
    data: {
      ...this.preSavedData,
      consultations: this.consultations,
    },
  })

  dialogRef.afterClosed().subscribe((result) => {
    this.retrieveVisitStats()
    if (result && result.isClose) {
      this.preSavedData = result
    }
  })
}

  deleteVisitDate(consultation: Consultation) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      autoFocus: false,
      width: '600px',
      data: {
        label: this.translatePipe.transform(
          'text.editor.edit.consultaionDateDelete',
          'Удаление даты консультации'
        ),
        message: this.translatePipe.transform(
          'text.editor.edit.consultaionDateDeleteQuestion',
          'Вы действительно хотите удалить дату консультации?'
        ),
        actionName: this.translatePipe.transform(
          'text.editor.edit.remove',
          'Удалить'
        ),
        color: 'primary',
      },
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result != null && result) {
        this.visitStatsService.deleteDate(consultation.Id).subscribe(() => {
          this.ngOnInit()
          this.addFlashMessage(
            this.translatePipe.transform(
              'text.editor.edit.dateRemoveAlert',
              'Дата успешно удалена'
            )
          )
        })
      }
    })
  }

  addFlashMessage(msg: string) {
    this.toastr.success(msg)
  }

  getExcelFile() {
    location.href =
      location.origin +
      '/api/DpStatistic' +
      `?isLecturer=${this.isLecturer}` +
      `&lecturerId=${this.lecturer ? this.lecturer.Id : ''}` +
      `&id=${this.diplomUser.UserId}`
  }

  downloadArchive() {
    location.href =
      location.origin +
      '/api/DpTaskSheetDownload' +
      `?isLecturer=${this.isLecturer}` +
      `&id=${this.diplomUser.UserId}`
  }
}
