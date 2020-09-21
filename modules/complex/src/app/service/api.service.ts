import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Login } from "../../../../admin/src/app/model/login";


@Injectable({
  providedIn: "root"
})
export class ApiService {

  constructor(private http: HttpClient) {
  }

  login(): Observable<Login> {
    return this.http.post<Login>('/api/Account/Login?userName=ypal0898&password=ypal0898', {});
  }
}
