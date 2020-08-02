import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";


@Injectable({
  providedIn: "root"
})
export class ConfirmationService {

  constructor(private http: HttpClient) {
  }

  public getGroups(): Observable<any> {
    //todo hardcode
    const subject = JSON.parse(localStorage.getItem("currentSubject"));
    return this.http.get<any>("/Services/CoreService.svc/GetOnlyGroups/" + subject.id || "3");
  }

  public getStudents(groupId): Observable<any> {
    return this.http.get<any>("/Services/CoreService.svc/GetStudentsByGroupId/" + groupId);
  }

  public confirmationStudent(studentId): Observable<any> {
    return this.http.put<any>("/Services/CoreService.svc/СonfirmationStudent/" + studentId, {});
  }

  public unconfirmationStudent(studentId): Observable<any> {
    return this.http.put<any>("/Services/CoreService.svc/UnConfirmationStudent/" + studentId, {});
  }
}
