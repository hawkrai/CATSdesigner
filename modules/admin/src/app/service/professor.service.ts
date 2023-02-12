import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { fileMaxSize } from "@webacad/ng-mat-file-upload";
import { Observable } from "rxjs";
import { Page } from "../model/page";
import { Professor, EditProfessor, AddProfessor } from "../model/professor";

@Injectable({
  providedIn: "root",
})
export class ProfessorService {
  api = "/Administration/";

  constructor(private http: HttpClient) {}

  getProfessorById(professorId): Observable<Professor> {
    return this.http.get<Professor>(
      this.api + "GetProfessorJson/" + professorId
    );
  }

  getProfessorByName(userName): Observable<Professor> {
    return this.http.get<Professor>(
      this.api + "GetProfessorByNameJsonAsync/?userName=" + userName
    );
  }

  getProfessors(): Observable<Professor[]> {
    return this.http.get<Professor[]>(this.api + "GetProfessorsJson");
  }

  getProfessorsPaged(
    pageIndex: number,
    pageSize: number,
    filter: string = null,
    orderBy: string = null,
    sortDirection: number = 0
  ): Observable<Page<Professor>> {
    let params = {
      pageIndex: pageIndex.toString(),
      pageSize: pageSize.toString(),
    };

    if (filter != null && filter.trim() != "") {
      params["filter"] = filter;
    }

    if (orderBy != null && orderBy.trim() != "") {
      params["orderBy"] = orderBy;
      params["sortDirection"] = sortDirection.toString();
    }

    return this.http.get<Page<Professor>>(
      this.api + "GetProfessorsPagedJsonAsync",
      { params: params }
    );
  }

  addProfessor(professor: AddProfessor) {
    return this.http.post(this.api + "AddProfessorJson", professor);
  }

  editProfessor(professor): Observable<EditProfessor> {
    return this.http.post<EditProfessor>(
      this.api + "SaveProfessorJson",
      professor
    );
  }

  deleteProfessor(professorId): Observable<void> {
    return this.http.get<void>(this.api + "DeleteLecturerJson/" + professorId);
  }
}
