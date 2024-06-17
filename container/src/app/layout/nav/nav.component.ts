import {Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core'
import { LayoutService } from '../layout.service'
import { AuthenticationService } from '../../core/services/auth.service'
import { first, takeUntil, tap } from 'rxjs/operators'
import { CoreService } from '../../core/services/core.service'
import { Subject, Subscription } from 'rxjs'
import {
  Lecturer,
  Student,
  Group,
} from '../../core/models/searchResults/search-results'
import { SearchService } from '../../core/services/searchResults/search.service'
import { ProfileService } from '../../core/services/searchResults/profile.service'
import { DataService } from '../../modules/chat/shared/services/dataService'
import { ChatService } from 'src/app/modules/chat/shared/services/chatService'
import { MenuService } from 'src/app/core/services/menu.service'
import { MatDialog } from '@angular/material/dialog'
import { AboutSystemPopoverComponent } from '../../about-system/about-popover/about-popover.component'
import { Router, ActivatedRoute } from '@angular/router'
import { ConfirmationService } from 'src/app/core/services/confirmation.service'
import { MatSelectionList } from '@angular/material/list'
import { MatSelect } from '@angular/material/select'
import {DOCUMENT} from "@angular/common";

interface DropDownValue {
  name: string
  value: string
}

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.less'],
})
export class NavComponent implements OnInit, OnDestroy {
  public isLector: boolean
  public isStudent: boolean
  public isAdmin: boolean
  public unRead = 0
  public unconfirmedStudents = 0
  private unsubscribeStream$: Subject<void> = new Subject<void>()
  public locales: DropDownValue[] = [
    { name: 'Ru', value: 'ru' },
    { name: 'En', value: 'en' },
  ]
  public locale: DropDownValue
  public profileIcon = '/assets/images/account.png'
  public userFullName
  public themes: DropDownValue[] = [
    { name: 'White', value: 'white' },
    { name: 'Dark', value: 'dark' },
  ]
  public theme: DropDownValue
  public isProgContol

  valueForSearch!: string
  showSearchResults = false
  searchResults!: string[]
  lecturerSearchResults!: Lecturer[]
  studentSearchResults!: Student[]
  groupSearchResults!: Group[]
  bestLecturerSearchResult!: Lecturer
  bestStudentSearchResult!: Student
  bestGroupSearchResult!: Group

  constructor(
    private layoutService: LayoutService,
    private router: Router,
    private coreService: CoreService,
    private chatService: ChatService,
    private dataService: DataService,
    private autService: AuthenticationService,
    private searchService: SearchService,
    private profileService: ProfileService,
    private menuService: MenuService,
    public dialog: MatDialog,
    private confirmationService: ConfirmationService,
    private route: ActivatedRoute,
    @Inject(DOCUMENT) private document: Document
  ) {}

  get logoWidth(): string {
    const width = this.menuService.getSideNavWidth()
    return width ? `${width - 16}px` : 'auto'
  }

  public ngOnInit(): void {
    this.isProgContol = false
    if (this.router.url == '/progControl') {
      this.isProgContol = true
    }
    this.isLector = false
    this.isAdmin = false
    if (this.autService.currentUserValue != undefined) {
      const authRole = this.autService.currentUserValue.role
      this.isLector = authRole === 'lector'
      this.isStudent = authRole === 'student'
      this.isAdmin = authRole === 'admin'
    }
    this.route.params
    this.getUserInfo()
    if (this.isLector) {
      this.confirmationService.confirmationSubject
        .pipe(takeUntil(this.unsubscribeStream$))
        .subscribe((value) => {
          this.unconfirmedStudents += value
        })
    }
    if (!localStorage.getItem('theme')) {
      localStorage.setItem('theme', 'white')
    }
    const local: string = localStorage.getItem('locale')
    this.locale = local
      ? this.locales.find((locale: DropDownValue) => locale.value === local)
      : this.locales[0]

    this.dataService.readMessageCount.subscribe((count) => {
      this.unRead -= count
    })

    if (this.autService.currentUserValue != undefined) {
      this.chatService.loadChats().subscribe((chats) =>
        chats.forEach((chat) => {
          this.unRead += chat.unread
        })
      )

      this.chatService.loadGroups().subscribe((groups) =>
        groups.forEach((subjectGroup) => {
          this.unRead += subjectGroup.unread
          subjectGroup.groups.forEach((group) => (this.unRead += group.unread))
        })
      )
    }
    if (this.isLector) {
      this.confirmationService
        .getUncofirmedStudentsCount()
        .pipe(takeUntil(this.unsubscribeStream$))
        .subscribe((count) => {
          this.unconfirmedStudents = count
        })
    }
  }

  public sidenavAction(): void {
    this.layoutService.toggle()
  }

  public logOut(): void {
    this.autService
      .logout()
      .pipe(first())
      .subscribe(() => location.reload())
  }

  private setCookie(name: string, value: string, days: number) {
    const date = new Date()
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
    const expires = "expires=" + date.toUTCString()
    this.document.cookie = name + "=" + value + ";" + expires + ";path=/"
  }

  private getCookie(name: string): string | null {
    const nameEQ = name + "="
    const ca = this.document.cookie.split(';')
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i]
      while (c.charAt(0) == ' ') c = c.substring(1, c.length)
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length)
    }
    return null
  }
  public onValueChange(value: any): void {
    localStorage.setItem('locale', value.value.value)
    this.setCookie('locale', value.value.value, 365)
    window.location.reload()
  }

  public routeToSearchResult(url: string, param): void {
    this.cleanSearchResults()
    this.router.navigate([url, param], { relativeTo: this.route })
  }

  public themeChange(value: any): void {
    localStorage.setItem('theme', value.value.value)
    window.location.reload()
  }

  public ngOnDestroy(): void {
    this.unsubscribeStream$.next(null)
    this.unsubscribeStream$.complete()
  }

  getUserInfo() {
    if (
      this.autService.currentUserValue != null &&
      this.autService.currentUserValue != undefined
    ) {
      this.profileService
        .getProfileInfo(this.autService.currentUserValue.id)
        .subscribe((res) => {
          this.profileIcon = res.Avatar
          this.userFullName = res.Name
        })
    }
  }
  viewSearchResults() {
    this.valueForSearch = this.valueForSearch.trim()
    if (this.valueForSearch.length >= 3) {
      this.viewGroupSearchResults()
      this.viewLecturerSearchResults()
      this.viewStudentSearchResults()
    } else {
      this.cleanSearchResults()
      //
    }
  }

  cleanSearchResults() {
    this.valueForSearch = ''
    this.lecturerSearchResults = null
    this.studentSearchResults = null
    this.groupSearchResults = null
    this.bestLecturerSearchResult = null
    this.bestStudentSearchResult = null
    this.bestGroupSearchResult = null
  }

  viewLecturerSearchResults() {
    this.searchService
      .getLecturerSearchResults(this.valueForSearch)
      .subscribe((res) => {
        if (res != null && res.length > 0) {
          this.lecturerSearchResults = res
          this.bestLecturerSearchResult = this.lecturerSearchResults[0]
          this.lecturerSearchResults = this.lecturerSearchResults
            .slice(1, this.lecturerSearchResults.length - 1)
            .sort((n1, n2) => n1.FullName.localeCompare(n2.FullName))
        }
      })
  }

  viewStudentSearchResults() {
    this.searchService
      .getStudentSearchResults(this.valueForSearch)
      .subscribe((res) => {
        if (res != null && res.length > 0) {
          this.studentSearchResults = res
          this.bestStudentSearchResult = this.studentSearchResults[0]
          this.studentSearchResults = this.studentSearchResults
            .slice(1, this.studentSearchResults.length - 1)
            .sort((n1, n2) => n1.FullName.localeCompare(n2.FullName))
        }
      })
  }

  viewGroupSearchResults() {
    this.searchService
      .getGroupSearchResults(this.valueForSearch)
      .subscribe((res) => {
        if (res != null && res.length > 0) {
          this.groupSearchResults = res
          this.bestGroupSearchResult = this.groupSearchResults[0]
          this.groupSearchResults = this.groupSearchResults
            .slice(1, this.groupSearchResults.length - 1)
            .sort((n1, n2) => n1.Name.localeCompare(n2.Name))
        }
      })
  }

  public routeToResult(relativePath) {
    this.router.navigate([relativePath])
    location.reload()
  }

  public routeToAboutPopover() {
    const dialogRef = this.dialog.open(AboutSystemPopoverComponent, {
      maxWidth: '600px',
      position: { top: '128px' },
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result != null) {
      }
    })
  }

  UpdateSearchResultView() {
    this.cleanSearchResults()
    window.location.reload()
  }

  public getUserInitials() {
    const initials =
      this.userFullName?.split(' ')[0]?.charAt(0) +
      this.userFullName?.split(' ')[1]?.charAt(0)
    if (initials != null) {
      return initials
    } else {
      return 'Ad'
    }
  }
}
