import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core'
import { DataService } from '@chat/shared/services/dataService'
import { Subscription } from 'rxjs'
import { SubjectGroups } from '@chat/shared/models/entities/subject.groups.model'

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss'],
})
export class GroupsComponent implements OnInit, OnDestroy {
  searchGroup: string
  groups: SubjectGroups[]
  oldGroups: SubjectGroups[]
  subscription: Subscription
  constructor(
    private cdr: ChangeDetectorRef,
    public dataService: DataService
  ) {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  ngOnInit(): void {
    this.dataService.loadGroups()
    this.subscription = this.dataService.groups.subscribe((groups) => {
      this.groups = groups
      this.oldGroups = [...groups]
      this.cdr.detectChanges()
    })
  }

  filter() {
    if (!this.searchGroup || this.searchGroup.trim() === '') {
      this.groups = [...this.oldGroups]
      this.cdr.detectChanges()
      return
    }
    const searchTerm = this.searchGroup.toLowerCase()

    const filteredSubjects = this.oldGroups
      .map((subject) => {
        const clonedSubject = { ...subject }

        if (subject.groups) {
          clonedSubject.groups = subject.groups.filter((group) =>
            group.name.toLowerCase().includes(searchTerm)
          )
        }
        return clonedSubject
      })
      .filter((subject) => {
        const subjectNameMatches =
          subject.name.toLowerCase().includes(searchTerm) ||
          subject.shortName.toLowerCase().includes(searchTerm)
        const hasMatchingChildGroups =
          subject.groups &&
          subject.groups.some((group) =>
            group.name.toLowerCase().includes(searchTerm)
          )

        if (subjectNameMatches) return true
        if (hasMatchingChildGroups) {
          const remainingChildGroups = subject.groups?.filter((g) =>
            g.name.toLowerCase().includes(searchTerm)
          )
          return remainingChildGroups && remainingChildGroups.length > 0
        }
        return false
      })

    this.groups = filteredSubjects
    this.cdr.detectChanges()
  }

  async showChat(value: any) {
    if (!value || !value.id) return
    const isSubjectChat = value.hasOwnProperty('groups')
    if (
      isSubjectChat &&
      this.isSubjectChatEffectivelyAStub(value as SubjectGroups)
    ) {
      return
    }

    this.dataService.setActiveChat(value.id, true, value)
  }

  onCompletedFilterChange(checked: boolean): void {
    this.groups = []
    this.searchGroup = ''
    this.oldGroups = []
    this.cdr.detectChanges()

    this.dataService.showCompletedFilterState.next(checked)
    this.dataService.loadGroups()
  }

  isSubjectChatEffectivelyAStub(subject: SubjectGroups): boolean {
    return (
      this.dataService.showCompletedFilterState.getValue() &&
      !!subject.isCompletedForUser
    )
  }
}
