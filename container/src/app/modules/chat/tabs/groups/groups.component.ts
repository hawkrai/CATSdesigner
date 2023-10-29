import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { DataService } from '../../shared/services/dataService'
import { Groups } from '../../shared/models/entities/groups.model'
import { Subscription } from 'rxjs'
import { SubjectGroups } from '../../shared/models/entities/subject.groups.model'

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
    this.dataService.messages.next([])
    this.dataService.activChat = null
    this.dataService.activChatId = 0
    this.dataService.activGroup = null
    this.dataService.isGroupChat = false
    this.subscription = this.dataService.groups.subscribe((groups) => {
      this.groups = groups
      this.oldGroups = groups
      this.cdr.detectChanges()
    })
    this.dataService.LoadGroup()
  }

  openGroupModal(content: any) {
    this.modalService.open(content, { centered: true })
  }

  filter() {
    var groups = new Array<SubjectGroups>()
    this.oldGroups.forEach((element) => {
      var subjectGroup = Object.create(element)
      var child = subjectGroup.groups.filter((x) =>
        x.name.includes(this.searchGroup)
      )
      if (child.length != 0) {
        subjectGroup.groups = child
        groups.push(subjectGroup)
      }
    })
    this.groups = groups
  }

  async showChat(value: any) {
    this.dataService.activChat = value
    this.dataService.activChatId = value.id
    this.dataService.isGroupChat = true
    this.dataService.groupRead()
    this.dataService.LoadGroupMsg()
    document.getElementById('chat-room').classList.add('user-chat-show')
  }
}
