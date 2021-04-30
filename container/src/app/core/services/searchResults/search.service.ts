import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Lecturer, Student, User, Group } from '../../models/searchResults/search-results';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  api = '/ElasticSearch/';
  /*api = '/Services/Parental/ParentalService.svc/';*/


  constructor(private http: HttpClient) {
  }

/*  getLecturerSearchResults(groupName: any): Observable<Lecturer[]> {
    return this.http.get<Lecturer[]>(this.api + 'GetGroupSubjectsByGroupName/' + groupName);
  }*/
  getLecturerSearchResults(searchString: any): Observable<Lecturer[]> {
    return this.http.get<Lecturer[]>(this.api + 'GetLecturerSearchResult/' + searchString);
  } 

  getStudentSearchResults(searchString: any): Observable<Student[]> {
    return this.http.get<Student[]>(this.api + 'GetStudentSearchResult/' + searchString);
  }

  getGroupSearchResults(searchString): Observable<Group[]> {
    return this.http.get<Group[]>(this.api + 'GetGroupSearchResult/' + searchString);
  }

}
