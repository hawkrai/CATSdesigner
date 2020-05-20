import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError, } from 'rxjs/operators';

import { Subject } from './../models/subject';

@Injectable({ providedIn: 'root' })
export class CoreService {
    private selectedSubject: Subject;
    private listOfSubjects: Subject[];

    constructor(private http: HttpClient) {        
    }

    getSubjects(): Observable<Subject[]>  {
        return this.http.get<any>(`/Services/Subjects/SubjectsService.svc/List`)
            .pipe(
                map(subjects => {
                    this.listOfSubjects = subjects.Subjects;

                    if(this.listOfSubjects.length > 0){
                        this.selectedSubject = this.listOfSubjects[0];
                    }                    
                    return this.listOfSubjects;                 
                })
            );
    }    
}