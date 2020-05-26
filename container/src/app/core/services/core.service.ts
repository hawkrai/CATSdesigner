import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError, } from 'rxjs/operators';

import { Subject } from './../models/subject';
import { Message } from './../models/message';

@Injectable({ providedIn: 'root' })
export class CoreService {
    public selectedSubject: Subject;
    private listOfSubjects: Subject[];
    
    constructor(private http: HttpClient) { 
        this.selectedSubject = null;       
    }

    public sendMessage(message: Message): void {
        window.frames[0].postMessage([{channel: message.Type, value: message.Value}], '*');
    }

    getSubjects(): Observable<Subject[]>  {
        return this.http.get<any>(`/Services/Subjects/SubjectsService.svc/List`)
            .pipe(
                map(subjects => {
                    this.listOfSubjects = subjects.Subjects;                                       
                    return this.listOfSubjects;                 
                })
            );
    }
    
    setCurrentSubject(subject: any): void {
        localStorage.setItem('currentSubject', JSON.stringify(subject));
    }

    removeCurrentSubject(): void {
        this.selectedSubject = null;
        localStorage.removeItem('currentSubject');    
    }

    getCurrentSubject(): any {
        return JSON.parse(localStorage.getItem('currentSubject'));
    }
}