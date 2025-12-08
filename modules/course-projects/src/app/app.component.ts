import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { IAppState } from './store/state/app.state';
import { select, Store } from '@ngrx/store';
import { MatOptionSelectionChange } from '@angular/material';
import { getSubjectId } from './store/selectors/subject.selector';
import { CourseUser } from './models/course-user.model';
import { CourseUserService } from './services/course-user.service';
import { GroupService } from './services/group.service';
import { HttpClient } from '@angular/common/http';
import { switchMap } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { CoreGroup } from './models/core-group.model';

interface GroupsResponse {
  Groups: CoreGroup[];
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent implements OnInit {
  public tab = 1;
  public groups: CoreGroup[] = [];
  public allGroups: CoreGroup[] = [];
  public selectedGroup: CoreGroup | null = null;
  public detachedGroup = false;
  public groupNumber: number | null = null;
  public groupId: number | null = null;

  private subjectId: string;
  public courseUser: CourseUser;
  public hasUnapprovedWorks = false;

  constructor(
    private courseUserService: CourseUserService,
    private groupService: GroupService,
    private store: Store<IAppState>,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) {}

  ngOnInit() {
    this.tab = Number(localStorage.getItem('courseProject_tab')) || 1;

    this.store.pipe(select(getSubjectId)).subscribe((subjectId) => {
      this.subjectId = subjectId;
      if (!this.subjectId) return;

      this.courseUserService
        .getUser()
        .pipe(
          switchMap((user) => {
            this.courseUser = user;
            return this.courseUserService.getUserInfo(user.UserId);
          })
        )
        .subscribe((userInfo) => {
          this.groupNumber = userInfo.Group;
          this.groupId = userInfo.GroupId;

          this.retrieveGroups(false);
        });
    });
  }

  onNewWorkEvent(hasNewWork: boolean) {
    this.zone.run(() => {
      this.hasUnapprovedWorks = hasNewWork;
      this.cdr.detectChanges();
    });
  }

  checkUnapprovedDefensesForGroup(groupId: number) {
    const url =
      '/course/Services/Courses/CoursesService.svc/GetFilesV2?isCp=true&subjectId=' +
      this.subjectId +
      '&groupId=' +
      groupId;

    return this.http.get<any>(url);
  }

  checkUnapprovedDefensesGlobally() {
    if (!this.allGroups || this.allGroups.length === 0) {
      this.hasUnapprovedWorks = false;
      return;
    }

    const requests = this.allGroups.map((group) =>
      this.checkUnapprovedDefensesForGroup(Number(group.GroupId))
    );

    forkJoin(requests).subscribe({
      next: (results) => {
        this.hasUnapprovedWorks = results.some((res) => {
          if (!res || !res.Students) return false;

          return res.Students.some((student: any) => {
            if (!Array.isArray(student.FileLabs)) return false;

            return student.FileLabs.some(
              (file: any) =>
                file.IsCoursProject === true && file.IsReceived === false
            );
          });
        });
      },
      error: () => {
        this.hasUnapprovedWorks = false;
      },
    });
  }

  acceptFile(fileId: number, groupId: number) {
    const url =
      '/course/Services/Courses/CoursesService.svc/AcceptFile?fileId=' + fileId;

    this.http.post(url, {}).subscribe({
      next: () => {
        setTimeout(() => this.checkUnapprovedDefensesGlobally(), 600);
      },
      error: (err) => console.error('Ошибка при принятии файла:', err),
    });
  }

  revokeFile(fileId: number) {
    const url =
      '/course/Services/Courses/CoursesService.svc/RevokeFile?fileId=' + fileId;

    this.http.post(url, {}).subscribe({
      next: () => {
        setTimeout(() => this.checkUnapprovedDefensesGlobally(), 600);
      },
      error: (err) => console.error('Ошибка при отзыве файла:', err),
    });
  }

  onChangeTab(tabNumber: number): void {
    localStorage.setItem('courseProject_tab', String(tabNumber));
    this.tab = tabNumber;
    this.checkUnapprovedDefensesGlobally();
  }

  _selectedGroup(event: MatOptionSelectionChange) {
    if (event.isUserInput) {
      const value = Number(event.source.value);
      this.selectedGroup =
        this.groups.find((res) => Number(res.GroupId) === value) || null;

      this.checkUnapprovedDefensesGlobally();
    }
  }

  groupStatusChange(event: any) {
    this.detachedGroup = event.checked;
    this.retrieveGroups(true);
  }

  retrieveGroups(groupStatusChanged: boolean) {
    const request$ = this.detachedGroup
      ? this.groupService.getDetachedGroups(this.subjectId)
      : this.groupService.getGroups(this.subjectId);

    request$.subscribe((res: GroupsResponse) => {
      this.groups = res.Groups || [];

      const newGroups = this.groups.filter(
        (g) => !this.allGroups.some((a) => a.GroupId === g.GroupId)
      );
      this.allGroups = this.allGroups.concat(newGroups);

      if (this.courseUser.IsStudent) {
        this.selectedGroup =
          this.groups.find((g) => Number(g.GroupId) === this.groupId) || null;
      } else {
        if (this.selectedGroup == null || groupStatusChanged) {
          this.selectedGroup = this.groups.length > 0 ? this.groups[0] : null;
        }
      }

      this.checkUnapprovedDefensesGlobally();
    });
  }

  getExcelFile() {
    if (!this.selectedGroup) return;

    if (this.tab === 4) {
      location.href =
        location.origin +
        '/api/CpStatistic?group=' +
        this.selectedGroup.GroupId +
        '&subjectId=' +
        this.subjectId;
    } else if (this.tab === 5) {
      location.href =
        location.origin +
        '/api/CpStatistic?groupId=' +
        this.selectedGroup.GroupId +
        '&subjectId=' +
        this.subjectId;
    }
  }

  downloadArchive() {
    if (!this.selectedGroup) return;

    location.href =
      location.origin +
      '/api/CPTaskSheetDownload?groupId=' +
      this.selectedGroup.GroupId +
      '&subjectId=' +
      this.subjectId;
  }
}
