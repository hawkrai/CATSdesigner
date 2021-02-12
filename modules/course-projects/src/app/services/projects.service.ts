import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class ProjectsService {

    constructor(private http: HttpClient) { }

    public getProjects(params: string): Observable<any> {
        return this.http.get('api/courseProject', { params: new HttpParams({ fromString: params }) });
    }

    public getProject(id: string): Observable<any> {
      return this.http.get('api/courseProject/' + id);
    }

    public chooseProject(projectId: string): Observable<any> {
      return this.http.post('api/courseProjectAssignment', {projectId});
    }

    public editProject(id: string, subjectId: string, theme: string, selectedGroupsIds: string[]): Observable<any> {
      return this.http.post('api/courseProject', {Id: id, SubjectId: subjectId, Theme: theme, SelectedGroupsIds: selectedGroupsIds});
    }

    public deleteProject(id: string): Observable<any> {
      return this.http.post('api/courseProject/' + id, null);
    }

    public getStudents(params: string): Observable<any> {
      return this.http.get('api/courseStudent', { params: new HttpParams({ fromString: params }) });
    }

    public assignProject(projectId: string, studentId: string): Observable<any> {
      return this.http.post('api/courseProjectAssignment', {projectId, studentId});
    }

    public approveChoice(projectId: string): Observable<any> {
      return this.http.post('api/courseProjectAssignment', {projectId});
    }

    public removeAssignment(id: string): Observable<any> {
      return this.http.post('api/courseProjectAssignment/' + id, null);
    }

}
