import { Component, OnInit } from '@angular/core';
import { ProfileService } from 'src/app/service/profile.service';
import { ActivatedRoute } from '@angular/router';
import { ProfileModel, ProfileInfo, ProfileInfoSubject, ProfileProject } from 'src/app/model/profile';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  displayedColumns = ['item'];
  displayedColumnsSecond = ['item', 'complete'];
  isLoad = false;
  profileInfo: ProfileInfo;
  profileInfoSubjects: ProfileInfoSubject[];
  profileProjects: ProfileProject[];

  constructor(private profileService: ProfileService, private route: ActivatedRoute) { }

  ngOnInit() {
    const login = this.route.snapshot.params.login;
    const profileModel = new ProfileModel();
    profileModel.userLogin = login;
    this.getProfileInfo(profileModel);
    this.getProfileInfoSubjects(profileModel);
    this.getProfileProjects(profileModel);
  }

  getProfileInfo(login) {
    this.profileService.getProfileInfo(login).subscribe( result => {
      this.profileInfo = result;
    });
  }

  getProfileInfoSubjects(login) {
    this.profileService.getProfileInfoSubjects(login).subscribe( result => {
      console.log(result);
      this.profileInfoSubjects = result;
      this.isLoad = true;
    });
  }

  getProfileProjects(login) {
    this.profileService.getProfileProjects(login).subscribe( result => {
      console.log(result);
      this.profileProjects = result;
    });
  }

}
