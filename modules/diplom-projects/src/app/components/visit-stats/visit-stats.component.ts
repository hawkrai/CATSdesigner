import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { VisitStats } from '../../models/visit-stats.model';
import { VisitStatsService } from '../../services/visit-stats.service';
import { Subscription } from 'rxjs';
import { Consultation } from '../../models/consultation.model';
import { ConsultationMark } from '../../models/consultation-mark.model';
import { DiplomUser } from '../../models/diplom-user.model';
import { AddDateDialogComponent } from './add-date-dialog/add-date-dialog.component';
import { MatDialog, MatOptionSelectionChange, MatSnackBar } from '@angular/material';
import { VisitingPopoverComponent } from '../../shared/visiting-popover/visiting-popover.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { CoreGroup } from 'src/app/models/core-group.model';
import { Lecturer } from 'src/app/models/lecturer.model';
import { TranslatePipe } from 'educats-translate';
import { ToastrService } from 'ngx-toastr';
import { GroupService } from 'src/app/services/group.service';

@Component({
  selector: 'app-visit-stats',
  templateUrl: './visit-stats.component.html',
  styleUrls: ['./visit-stats.component.less']
})
export class VisitStatsComponent implements OnInit {
  @Input() diplomUser: DiplomUser;

  private COUNT = 1000;
  private PAGE = 1;

  private visitStatsSubscription: Subscription;

  private visitStatsList: VisitStats[];
  private filteredVisitStatsList: VisitStats[];
  private consultations: Consultation[];
  private lecturers: Lecturer[];
  private index = 0;
  private lecturer: Lecturer;
  public isLecturer = false;

  public themes = [{ name: this.translatePipe.transform('text.diplomProject.head', "Руководитель проекта"), value: true }, { name: this.translatePipe.transform('text.diplomProject.secretary', "Секретарь ГЭК"), value: false }];
  public theme = undefined;

  private preSavedData: Consultation = null;

  private searchString = '';

  constructor(private visitStatsService: VisitStatsService,
    public dialog: MatDialog,
    private toastr: ToastrService,
    private groupService: GroupService,
    public translatePipe: TranslatePipe) {
  }

  ngOnInit() {
    const toggleValue: string = localStorage.getItem('toggle');
    if (toggleValue && this.diplomUser.IsLecturer) {
      this.isLecturer = (localStorage.getItem('toggle') === 'false' ? false : true);
    } else {
      this.isLecturer = this.diplomUser.IsLecturer;
    }
    this.theme = this.isLecturer ? this.themes[0] : this.themes[1];
    this.retrieveVisitStats();
  }

  selectedLecturer(event: any) {
    this.index = this.lecturers.map(function (e) { return e.Id; }).indexOf(event.Id);
    this.retrieveVisitStats()
  }

  public getDiplomUser() {
    return this.diplomUser;
  }

  retrieveVisitStats() {
    if (this.diplomUser.IsSecretary && !this.isLecturer) {
      this.visitStatsService.getLecturerDiplomGroups({ entity: 'LecturerForSecretary', id: this.diplomUser.UserId })
        .subscribe(res => {
          this.lecturers = res.sort((a, b) => a.Name < b.Name ? -1 : 1)
          this.lecturer = res[this.index]
          this.visitStatsList = null;
          const lecturerId: string = this.lecturers[this.index] ? this.lecturers[this.index].Id : '0';
          this.visitStatsSubscription = this.visitStatsService.getVisitStats({
            count: this.COUNT, page: this.PAGE,
            filter: '{"isSecretary":"' + this.isLecturer + '","lecturerId":"' + lecturerId + '","searchString":"' + this.searchString + '"}'
          })
            .subscribe(res => {
              this.visitStatsList = this.assignResults(res.Students.Items, res.DiplomProjectConsultationDates);
              this.consultations = res.DiplomProjectConsultationDates;
              this.filteredVisitStatsList = this.visitStatsList;
            });
        });
    }
    else {
      this.visitStatsList = null;
      this.visitStatsSubscription = this.visitStatsService.getVisitStats({
        count: this.COUNT, page: this.PAGE,
        filter: '{"isSecretary":"' + false + '","searchString":"' + this.searchString + '"}'
      })
        .subscribe(res => {
          this.visitStatsList = this.assignResults(res.Students.Items, res.DiplomProjectConsultationDates);
          this.consultations = res.DiplomProjectConsultationDates;
          this.filteredVisitStatsList = this.visitStatsList;
        });
    }
  }

  onSearchChange(searchText: string) {
    this.searchString = searchText;
    this.updateStats();
  }

  lecturerStatusChange(event) {
    this.isLecturer = event.value.value;
    localStorage.setItem('toggle', event.value.value);
    this.retrieveVisitStats()
  }

  updateStats() {
    if (this.visitStatsSubscription) {
      this.visitStatsSubscription.unsubscribe();
    }
    this.retrieveVisitStats();
  }

  assignResults(visitStats: VisitStats[], consultations: Consultation[]): VisitStats[] {
    // this.groups = visitStats.map(a => a.Group).filter((v, i, a) => a.indexOf(v) === i);
    for (const student of visitStats) {
      const results: ConsultationMark[] = [];
      for (const consultation of consultations) {
        const result = student.DiplomProjectConsultationMarks.find(cm => cm.ConsultationDateId === consultation.Id);
        if (result != null) {
          if (result.Mark != null) {
            result.Mark = result.Mark.trim();
          }
          results.push(result);
        } else {
          // @ts-ignore
          const cm: ConsultationMark = { StudentId: student.Id, ConsultationDateId: consultation.Id };
          results.push(cm);
        }
      }
      student.DiplomProjectConsultationMarks = results;
    }
    return visitStats;
  }

  setVisitMarks(consultationDateId: string) {
    const date = new Date(this.consultations.find(consultation => consultation.Id === consultationDateId).Day).toLocaleDateString();
    const visits = { date, students: [] };
    this.visitStatsList.forEach(stats => {
      const mark = stats.DiplomProjectConsultationMarks.find(stat => stat.ConsultationDateId === consultationDateId);
      const visit = {
        name: stats.Name,
        mark: mark.Mark,
        comments: mark.Comments,
        id: mark.Id,
        consultationDateId: mark.ConsultationDateId,
        studentId: mark.StudentId
      };
      visits.students.push(visit);
    });

    const dialogRef = this.dialog.open(VisitingPopoverComponent, {
      autoFocus: false,
      width: '548px',
      height: '100%',
      data: {
        title: this.translatePipe.transform('text.diplomProject.studentAttendance', "Посещение консультации"),
        buttonText: this.translatePipe.transform('button.save', "Сохранить"),
        body: visits
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.processDialogResult(result, false);
      }
    });
  }

  processDialogResult(result: any, hasChanges: boolean) {
    const visit = result.students.pop();
    if (visit != null) {
      if (visit.id == null) {
        if (visit.mark || visit.comment || visit.comment !== '') {
          hasChanges = true;
          this.visitStatsService.setMark(visit.studentId, visit.consultationDateId, visit.mark, visit.comment, visit.showForStudent)
            .subscribe(() => this.processDialogResult(result, hasChanges));
        } else {
          this.processDialogResult(result, hasChanges);
        }
      } else {
        const origin = this.visitStatsList.find(stats => stats.Id === visit.studentId).DiplomProjectConsultationMarks
          .find(mark => mark.Id === visit.id);
        if (origin.Mark !== visit.mark || origin.Comments !== visit.comment) {
          hasChanges = true;
          this.visitStatsService.editMark(visit.id, visit.studentId, visit.consultationDateId, visit.mark, visit.comment, visit.showForStudent)
            .subscribe(() => this.processDialogResult(result, hasChanges));
        } else {
          this.processDialogResult(result, hasChanges);
        }
      }
    } else if (hasChanges) {
      this.ngOnInit();
      this.addFlashMessage(this.translatePipe.transform('text.editor.edit.attendanceAlert', "Посещаемость успешно обновлена"));
    }
  }

  addDate() {
    const dialogRef = this.dialog.open(AddDateDialogComponent, {
      autoFocus: false,
      width: '548px',
      height: '100%',
      data: {
        ...this.preSavedData,
        consultations: this.consultations,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null && !result.isClose) {
        const date = new Date(result.date);
        date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
        this.visitStatsService.addDate(date.toISOString(), result.start,
          result.end, result.audience, result.building).subscribe(() => {
            this.ngOnInit();
            this.addFlashMessage(this.translatePipe.transform('text.course.visit.dialog.add.save.success', 'Дата консультации успешно добавлена'));
          });
      }
      if (result.isClose) {
        this.preSavedData = result;
      }
    });
  }

  deleteVisitDate(consultation: Consultation) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      autoFocus: false,
      width: '400px',
      data: {
        label: this.translatePipe.transform('text.editor.edit.consultaionDateDelete', "Удаление даты консультации"),
        message: this.translatePipe.transform('text.editor.edit.consultaionDateDeleteQuestion', "Вы действительно хотите удалить дату консультации?"),
        actionName: this.translatePipe.transform('text.editor.edit.remove', "Удалить"),
        color: 'primary'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null && result) {
        this.visitStatsService.deleteDate(consultation.Id).subscribe(() => {
          this.ngOnInit();
          this.addFlashMessage(this.translatePipe.transform('text.editor.edit.dateRemoveAlert', "Дата успешно удалена"));
        });
      }
    });
  }

  addFlashMessage(msg: string) {
    this.toastr.success(msg);
  }

  getExcelFile() {
    location.href = location.origin + '/api/DpStatistic' + `?isLecturer=${this.isLecturer}` + `&lecturerId=${this.lecturer.Id}` + `&id=${this.diplomUser.UserId}`;
  }

  downloadArchive() {
    location.href = location.origin + '/api/DpTaskSheetDownload' + `?isLecturer=${this.isLecturer}` + `&id=${this.diplomUser.UserId}`;
  }

}
