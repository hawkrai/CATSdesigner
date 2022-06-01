import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Module } from "../models/module.model";

@Injectable({ providedIn: 'root' })
export class SubjectService {

    constructor(private http: HttpClient) {}

    public getSubjectModules(subjectId: number): Observable<Module[]> {
        return this.http.get<Module[]>(`/Services/Subjects/SubjectsService.svc/Modules/${subjectId}`);
      }
}