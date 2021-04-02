import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class ProjectsService {

    constructor(private http: HttpClient) { }

    public getProjects(params: string): Observable<any> {
        return this.http.get('api/diplomProject', { params: new HttpParams({ fromString: params }) });
    }

    public getProject(id: string): Observable<any> {
      return this.http.get('api/diplomProject/' + id);
    }

    public chooseProject(projectId: string): Observable<any> {
      return this.http.post('api/diplomProjectAssignment', {projectId});
    }

    public editProject(id: string, theme: string, selectedGroupsIds: string[]): Observable<any> {
      return this.http.post('api/diplomProject', {Id: id, Theme: theme, SelectedGroupsIds: selectedGroupsIds});
    }

    public deleteProject(id: string): Observable<any> {
      return this.http.post('api/diplomProject/' + id, null);
    }

    public getStudents(params: string): Observable<any> {
      return this.http.get('api/diplomStudent', { params: new HttpParams({ fromString: params }) });
    }

    public assignProject(projectId: string, studentId: string): Observable<any> {
      return this.http.post('api/diplomProjectAssignment', {projectId, studentId});
    }

    public approveChoice(projectId: string): Observable<any> {
      return this.http.post('api/diplomProjectAssignment', {projectId});
    }

    public removeAssignment(id: string): Observable<any> {
      return this.http.post('api/diplomProjectAssignment/' + id, null);
    }

}
