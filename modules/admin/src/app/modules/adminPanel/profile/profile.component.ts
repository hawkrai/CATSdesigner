import { Component, OnInit } from '@angular/core';
import { ProfileService } from 'src/app/service/profile.service';
import { ActivatedRoute } from '@angular/router';
import { ProfileModel, ProfileInfo, ProfileInfoSubject, ProfileProject } from 'src/app/model/profile';
import { AccountService } from 'src/app/service/account.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  
})


export class ProfileComponent implements OnInit {
  displayedColumns = ['item'];
  displayedColumnsSecond = ['item', 'complete'];
  isLoad = false;
  defaultAvatar = "/assets/images/account.png";
  Name!: string;
  Surname!: string;

  profileInfo!: ProfileInfo;
  profileInfoSubjects!: ProfileInfoSubject[];
  cpProfileProjects!: ProfileProject[];
  dpProfileProjects!: ProfileProject[];
  currentSubjects!: ProfileInfoSubject[];
  archivedSubjects!: ProfileInfoSubject[];


  constructor(private profileService: ProfileService, private route: ActivatedRoute) { }
   
  ngOnInit(): void {
    const Id = this.route.snapshot.params.id;
    const profileModel = new ProfileModel();
    profileModel.Id = Id;
    this.getProfileInfo(profileModel.Id);
    this.getProfileInfoSubjects(profileModel.Id);
    this.getCpProfileProjects(profileModel.Id);
    this.getDpProfileProjects(profileModel.Id);
  }

  isStudent() {
    return this.profileInfo.UserType == "2";
  }
  getProfileInfo(id: any) {
    this.profileService.getProfileInfoById(id).subscribe((res) => {
      this.profileInfo = res;
      console.log(res);
      this.Surname = this.profileInfo.Name.split(' ')[0];
      this.Name = this.profileInfo.Name.split(' ')[1];
    }); 
  }

  getCpProfileProjects(id: any) {
    this.profileService.getCpProfileProjects(id).subscribe((res: any) => {
      this.cpProfileProjects = res;
      this.cpProfileProjects = this.cpProfileProjects.sort((a,b) =>  this.sortFunc(a, b));
    });
  }

  getDpProfileProjects(id: any) {
    this.profileService.getDpProfileProjects(id).subscribe((res: any) => {
      this.dpProfileProjects = res;
      this.dpProfileProjects = this.dpProfileProjects.sort((a,b) =>  this.sortFunc(a, b));
    });
  }
  
  getProfileInfoSubjects(id: any) {
    this.profileService.getProfileInfoSubjectsById(id).subscribe((res: any) => {
      this.profileInfoSubjects = res;
      this.archivedSubjects = this.profileInfoSubjects.filter(this.archivedFilter).sort((a,b) =>  this.sortFunc(a, b));
      this.currentSubjects = this.profileInfoSubjects.filter(this.currentFilter).sort((a,b) => this.sortFunc(a, b));
      this.isLoad = true;
    });
  }

  sortFunc(a, b) { 
    if(a.Completing < b.Completing){
      return -1;
    }

    else if(a.Completing > b.Completing){
      return 1;
    }
    
    else{
      if(a.Name < b.Completing){
        return -1;
      }
  
      else if(a.Completing > b.Completing){
        return 1;
      }
  
      return 0;
    }
    
 } 

  currentFilter(element, index, array) { 
    return (!element.IsArchived); 
 } 

  archivedFilter(element, index, array) { 
   return (element.IsArchived); 
 } 

 

}


