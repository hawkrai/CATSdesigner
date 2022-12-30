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
  cpColumns = ['item', 'subjectName'];
  dpColumns = ['item']
  subjectsColumns = ['item', 'complete'];
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

  getDpString(){
    if(this.isStudent()){
      return "Дипломный проект пользователя"
    }
    else{
      return "Дипломные проекты пользователя"
    }
  }
  getProfileInfo(id: any) {
    this.profileService.getProfileInfoById(id).subscribe((res) => {
      this.profileInfo = res;
      console.log(res);
      console.log(this.profileInfo.UserType == "2");
      this.Surname = this.profileInfo.Name.split(' ')[0];
      this.Name = this.profileInfo.Name.split(' ')[1];
    }); 
  }

  getCpProfileProjects(id: any) {
    this.profileService.getCpProfileProjects(id).subscribe((res: any) => {
      this.cpProfileProjects = res;
      this.cpProfileProjects = this.sortProjects(this.cpProfileProjects);
    });
  }

  getDpProfileProjects(id: any) {
    this.profileService.getDpProfileProjects(id).subscribe((res: any) => {
      this.dpProfileProjects = res;
      this.dpProfileProjects = this.sortProjects(this.dpProfileProjects);
    });
  }
  
  getProfileInfoSubjects(id: any) {
    this.profileService.getAllProfileInfoSubjectsById(id).subscribe((res: any) => {
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
      if(a.Name < b.Name){
        return -1;
      }
  
      else if(a.Name > b.Name){
        return 1;
      }

      return 0;
    }
 } 

  compare(a, b) {
    if (a > b) {
      return 1;
    }

    if (a < b) {
      return -1;
    }

    return 0;
  }

  compareByKey(a, b, key) {
    return this.compare(key(a), key(b))
  }

  sortProjects(array) {
    return Array.from(this.groupBy(array, (x) => x.SubjectName).entries())
      .sort((a, b) => this.compare(a[0], b[0]))
      .map((x) => x[1].sort((a, b) => this.compareByKey(a, b, x => x.Name.trim())))
      .reduce((acc, value) => {
        acc.push(...value);
        return acc; 
      }, []);
  }

  currentFilter(element, index, array) { 
    return (element.IsActive); 
 } 

  archivedFilter(element, index, array) { 
   return (!element.IsActive); 
 } 

  groupBy(array, keyGetter) {
    const map = new Map();

    for (const item of array) {
      let key = keyGetter(item);
      let collection = map.get(key);

      if (!collection) {
          map.set(key, [item]);
      } else {
          collection.push(item);
      }
    }

    return map;
  }
}


