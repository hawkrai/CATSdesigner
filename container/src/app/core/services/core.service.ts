import { Router } from '@angular/router';
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Location} from '@angular/common';
import * as rxjs from 'rxjs';
import {map} from "rxjs/operators";
import { ToastrService } from 'ngx-toastr';
import {Message} from "../models/message";
import { Module } from "../models/module.model";
import { Subject } from '../models/subject';
import { Lector } from '../models/lector.model';
import { ConfirmationService } from './confirmation.service';

type Tooltip = 'success' | 'warning';

@Injectable({providedIn: "root"})
export class CoreService {
  public selectedSubject: Subject;
  private listOfSubjects: Subject[];

  private subjectIdSub = new rxjs.Subject<number>();
  private updateSubjectSub = new rxjs.Subject<void>();

  constructor(
    private http: HttpClient,
    private router: Router,
    private location: Location,
    private toastrService: ToastrService,
    private confirmationService: ConfirmationService
    ) {
    this.selectedSubject = null;
  }

  public onNewSubjectId(): rxjs.Observable<number> {
    return this.subjectIdSub.asObservable();
  }

  public onUpdateSubjects(): rxjs.Observable<void> {
    return this.updateSubjectSub.asObservable();
  }

  public sendMessage(message: Message): void {
    window.frames[0].postMessage([{channel: message.Type, value: message.Value}], "*");
  }

  public setupMessageCommunication(): void {
    window.addEventListener("message", (event: MessageEvent) => this.receiveMessage(event), false);          
}

  private receiveMessage(event: MessageEvent): void {
      let message: any = event.data[0];
      event.stopImmediatePropagation();

      if (!message) {
          return;
      }
      console.log(`New message - ${message.channel} , value - ${message.value}`);
      if (message.channel == "Route"){
        this.router.navigateByUrl(`/${message.value}`);
      }      
      if (message.channel === 'Comfirmation') {
        this.confirmationService.confirmationSubject.next(+message.value);
      }

      if (message.channel === 'Location') {
        this.location.go(message.value);
      }

      if (message.channel === 'SubjectId') {
        this.subjectIdSub.next(+message.value);
      }  
      if (message.channel === 'UpdateSubjects') {
        this.updateSubjectSub.next();
      }

      if (message.channel === 'Toast') {
        const tooltip: { text: string, type: Tooltip } = JSON.parse(message.value);
        this.toastrService[tooltip.type](tooltip.text);
      }
    };

  public getSubjects(): rxjs.Observable<Subject[]> {
    return this.http.get<any>(`/Services/Subjects/SubjectsService.svc/List`)
      .pipe(
        map(subjects => {
          this.listOfSubjects = subjects.Subjects;
          return this.listOfSubjects;
        })
      );
  }

  public getUserSubjects(): rxjs.Observable<Subject[]> {
    return this.http.get<any>(`/Services/Subjects/SubjectsService.svc/GetUserSubjects`).pipe(
      map(subjects => {
        this.listOfSubjects = subjects.Subjects;
        return this.listOfSubjects;
      })
    );
  }

  public getSubjectModules(subjectId: number): rxjs.Observable<Module[]> {
    return this.http.get<Module[]>(`/Services/Subjects/SubjectsService.svc/Modules/${subjectId}`);
  }

  public getGroups(): rxjs.Observable<any> {
    return this.http.get<any>("/Services/CoreService.svc/GetAllGroupsLite/");
  }

  public setCurrentSubject(subject: any): void {
    localStorage.setItem("currentSubject", JSON.stringify(subject));
  }

  public isUserAssignedToSubject(subjectId: number): rxjs.Observable<boolean> {
    return this.http.get(`Services/Subjects/SubjectsService.svc/Assigned/${subjectId}`).pipe(
      map(response => response['IsAssigned'])
    );
  }

  public removeCurrentSubject(): void {
    this.selectedSubject = null;
    localStorage.removeItem("currentSubject");
  }

  public getCurrentSubject(): any {
    return JSON.parse(localStorage.getItem("currentSubject"));
  }

  public getSubjectOwner(subjectId: number): rxjs.Observable<Lector> {
    return this.http.get(`/Services/Subjects/SubjectsService.svc/GetSubjectOwner/${subjectId}`).pipe(
      map(response => response['Lector'])
    );
  }
}
