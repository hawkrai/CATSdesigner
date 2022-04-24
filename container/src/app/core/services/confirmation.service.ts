import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({ providedIn: 'root' })
export class ConfirmationService {

    constructor(
        private http: HttpClient
    ) {}

    confirmationSubject = new Subject<number>();

    getUncofirmedStudentsCount() {
        return this.http.get<any>(`/Services/CoreService.svc/GetUserGroups`)
            .pipe(map(x => x.Groups.reduce((acc, x) =>  acc + x.CountUnconfirmedStudents, 0)));
      }
}