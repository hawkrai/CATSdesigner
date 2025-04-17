import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { DataService } from '@chat/shared/services/dataService'
import { Subscription } from 'rxjs'
import { SubjectGroups } from '@chat/shared/models/entities/subject.groups.model'
import { IndexComponent } from '@chat/tabs/index/index.component'

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
    private modalService: NgbModal,
    public dataService: DataService
  ) {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  ngOnInit(): void {
    this.subscription = this.dataService.groups.subscribe((groups) => {
      this.groups = groups
      this.oldGroups = groups
      this.cdr.detectChanges()
    })
  }

  openGroupModal(content: any) {
    this.modalService.open(content, { centered: true })
  }

  filter() {
    if (!this.searchGroup || this.searchGroup.trim() === '') {
      this.groups = this.oldGroups
      return
    }
    const searchTerm = this.searchGroup.toLowerCase()
    const filteredGroups = new Array<SubjectGroups>()
    this.oldGroups.forEach((element) => {
      const filteredChildGroups =
        element.groups?.filter((x) =>
          x.name.toLowerCase().includes(searchTerm)
        ) ?? []

      const subjectMatches =
        element.name.toLowerCase().includes(searchTerm) ||
        element.shortName.toLowerCase().includes(searchTerm)

      if (subjectMatches || filteredChildGroups.length > 0) {
        const subjectGroupClone = { ...element }
        subjectGroupClone.groups =
          filteredChildGroups.length > 0 ? filteredChildGroups : element.groups
        filteredGroups.push(subjectGroupClone)
      }
    })
    this.groups = filteredGroups
  }

  async showChat(value: any) {
    if (!value || !value.id) return
    this.dataService.setActiveChat(value.id, true, value)
  }
}
