import { Component, OnInit } from '@angular/core'
import { ProfileService } from '../../core/services/searchResults/profile.service'
import {
  ProfileModel,
  ProfileInfo,
  ProfileInfoSubject,
  ProfileProject,
} from '../../core/models/searchResults/profile'
import { ActivatedRoute } from '@angular/router'
import { TranslatePipe } from 'educats-translate'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  displayedColumns = ['item']
  displayedColumnsSecond = ['item', 'complete']
  isLoad = false
  defaultAvatar = '/assets/images/account.png'
  Name!: string
  Surname!: string

  profileInfo!: ProfileInfo
  profileInfoSubjects!: ProfileInfoSubject[]
  cpProfileProjects!: ProfileProject[]
  dpProfileProjects!: ProfileProject[]
  currentSubjects!: ProfileInfoSubject[]
  archivedSubjects!: ProfileInfoSubject[]

  constructor(
    private profileService: ProfileService,
    private route: ActivatedRoute,
    private translatePipe: TranslatePipe
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.getProfileInfo(params['id'])
      this.getProfileInfoSubjects(params['id'])
      this.getCpProfileProjects(params['id'])
      this.getDpProfileProjects(params['id'])
    })
  }

  isStudent() {
    return this.profileInfo.UserType == '2'
  }

  getDpString() {
    if (this.isStudent()) {
      return this.translatePipe.transform(
        'text.profile.dpOne',
        'Текущий дипломные проект'
      )
    } else {
      return this.translatePipe.transform(
        'text.profile.dp',
        'Текущие дипломные проекты'
      )
    }
  }
  getProfileInfo(id: any) {
    this.profileService.getProfileInfo(id).subscribe((res) => {
      this.profileInfo = res
      console.log(res)
      this.Surname = this.profileInfo.Name.split(' ')[0]
      this.Name = this.profileInfo.Name.split(' ')[1]
    })
  }

  getCpProfileProjects(id: any) {
    this.profileService.getCpProfileProjects(id).subscribe((res: any) => {
      this.cpProfileProjects = res
      this.cpProfileProjects = this.cpProfileProjects.sort((a, b) =>
        this.sortFunc(a, b)
      )
    })
  }

  getDpProfileProjects(id: any) {
    this.profileService.getDpProfileProjects(id).subscribe((res: any) => {
      this.dpProfileProjects = res
      this.dpProfileProjects = this.dpProfileProjects.sort((a, b) =>
        this.sortFunc(a, b)
      )
    })
  }

  getProfileInfoSubjects(id: any) {
    this.profileService.getProfileInfoSubjectsById(id).subscribe((res: any) => {
      this.profileInfoSubjects = res
      this.archivedSubjects = this.profileInfoSubjects
        .filter(this.archivedFilter)
        .sort((a, b) => this.sortFunc(a, b))
      this.currentSubjects = this.profileInfoSubjects
        .filter(this.currentFilter)
        .sort((a, b) => this.sortFunc(a, b))
      this.isLoad = true
    })
  }

  sortFunc(a, b) {
    if (a.Completing < b.Completing) {
      return -1
    } else if (a.Completing > b.Completing) {
      return 1
    } else {
      if (a.Name < b.Completing) {
        return -1
      } else if (a.Completing > b.Completing) {
        return 1
      }

      return 0
    }
  }

  currentFilter(element, index, array) {
    return element.IsActive
  }

  archivedFilter(element, index, array) {
    return !element.IsActive
  }
}
