import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../core/services/searchResults/profile.service';
import { ProfileModel, ProfileInfo, ProfileInfoSubject, ProfileProject } from '../../core/models/searchResults/profile';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  
})


export class ProfileComponent implements OnInit {
  displayedColumns = ['item'];
  displayedColumnsSecond = ['item', 'complete'];
  isLoad = false;
  defaultAvatar!:string;
 
  profileInfo!: ProfileInfo;
  profileInfoSubjects!: ProfileInfoSubject[];
  profileProjects!: ProfileProject[];

  

  constructor(private profileService: ProfileService, private route: ActivatedRoute) { }
   
  ngOnInit(): void {
    const Id = this.route.snapshot.params.id;
    const profileModel = new ProfileModel();
    profileModel.Id = Id;
    this.getProfileInfo(profileModel.Id);
    this.getProfileInfoSubjects(profileModel.Id);
    this.getProfileProjects(profileModel.Id);
    this.getAvatar();
  }

 

  getProfileInfo(id: any) {
    this.profileService.getProfileInfo(id).subscribe((res) => {
      this.profileInfo = res;
      console.log(res);
    });
  }

  getAvatar() {
    this.profileService.getDefaultAvatar().subscribe(res => {
      this.defaultAvatar = res;
      });
  }

  getProfileProjects(id: string) {
    this.profileService.getProfileProjects(id).subscribe((res: any) => {
      this.profileProjects = res;
    });
  }

  getProfileInfoSubjects(id: any) {
    this.profileService.getProfileInfoSubjects(id).subscribe((res: any) => {
      this.profileInfoSubjects = res;
      this.isLoad = true;
    });
  }


}


