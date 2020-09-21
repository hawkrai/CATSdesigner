import { Component, OnInit } from '@angular/core';
import { ProfileService } from 'src/app/service/profile.service';
import { ActivatedRoute } from '@angular/router';
import { ProfileModel, ProfileInfo, ProfileInfoSubject, ProfileProject } from 'src/app/model/profile';
import { AccountService } from 'src/app/service/account.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  displayedColumns = ['item'];
  displayedColumnsSecond = ['item', 'complete'];
  isLoad = false;
  defaultAvatar: string;
  profileInfo: ProfileInfo;
  profileInfoSubjects: ProfileInfoSubject[];
  profileProjects: ProfileProject[];

  constructor(private profileService: ProfileService, private accountService: AccountService, private route: ActivatedRoute) { }

  ngOnInit() {
    const login = this.route.snapshot.params.login;
    const profileModel = new ProfileModel();
    profileModel.userLogin = login;
    this.getProfileInfo(profileModel);
    this.getProfileInfoSubjects(profileModel);
    this.getProfileProjects(profileModel);
    this.getAvatar();
  }

  getProfileInfo(login) {
    this.profileService.getProfileInfo(login).subscribe( res => {
      this.profileInfo = res;
      console.log(res);
    });
  }

  getAvatar() {
    this.accountService.getDefaultAvatar().subscribe( res => {
      this.defaultAvatar = res;
    });
  }

  getProfileInfoSubjects(login) {
    this.profileService.getProfileInfoSubjects(login).subscribe( res => {
      this.profileInfoSubjects = res;
      this.isLoad = true;
    });
  }

  getProfileProjects(login) {
    this.profileService.getProfileProjects(login).subscribe( res => {
      this.profileProjects = res;
    });
  }

}
