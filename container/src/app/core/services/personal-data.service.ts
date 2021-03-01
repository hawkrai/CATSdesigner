import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Injectable } from "@angular/core";
import { ProfileData } from '../models/personal-data';


@Injectable({
    providedIn: 'root'
})




export class PersonalDataService {

  constructor(private http: HttpClient) {
  }

  getProfileData() {
    return this.http.get<ProfileData>(`/Account/GetCurrentPersonalData`)
  }

  changePassword(old: string, newPassword: string) {
    return this.http.post<any>(`/Account/SavePassword`, {
      old: old ,
      newPassword: newPassword
      })
   }

  changeProfileData(model: ProfileData, avatar: string) {
    return this.http.post<any>(`/Account/UpdatePerconalData`, {
      model: model,
      avatar: avatar
    })
  }
}
