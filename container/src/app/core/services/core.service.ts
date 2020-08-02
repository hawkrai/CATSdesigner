import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {map,} from "rxjs/operators";

import {Subject} from "../models/subject";
import {Message} from "../models/message";


@Injectable({providedIn: "root"})
export class CoreService {
  public selectedSubject: Subject;
  private listOfSubjects: Subject[];

  constructor(private http: HttpClient) {
    this.selectedSubject = null;
  }

  public sendMessage(message: Message): void {
    window.frames[0].postMessage([{channel: message.Type, value: message.Value}], "*");
  }

  public getSubjects(): Observable<Subject[]> {
    return this.http.get<any>(`/Services/Subjects/SubjectsService.svc/List`)
      .pipe(
        map(subjects => {
          this.listOfSubjects = subjects.Subjects;
          return this.listOfSubjects;
        })
      );
  }

  public getGroups(): Observable<any> {
    return this.http.get<any>("/Services/CoreService.svc/GetOnlyGroups/3");
  }

  public setCurrentSubject(subject: any): void {
    localStorage.setItem("currentSubject", JSON.stringify(subject));
  }

  public removeCurrentSubject(): void {
    this.selectedSubject = null;
    localStorage.removeItem("currentSubject");
  }

  public getCurrentSubject(): any {
    return JSON.parse(localStorage.getItem("currentSubject"));
  }
}
