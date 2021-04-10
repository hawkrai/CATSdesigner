import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {TaskSheetTemplate} from '../models/task-sheet-template.model';
import {TaskSheet} from '../models/task-sheet.model';

@Injectable({
  providedIn: 'root'
})

export class TaskSheetService {

  constructor(private http: HttpClient) {
  }

  public getTaskSheetHtml(params: any): Observable<any> {
    return this.http.get('api/DpTaskSheetHtml', {params: new HttpParams({fromObject: params})});
  }

  public getTaskSheet(params: any): Observable<any> {
    return this.http.get('api/DpTaskSheet', {params: new HttpParams({fromObject: params})});
  }

  public getTaskSheets(params: string): Observable<any> {
    return this.http.get('api/DpTaskSheet', { params: new HttpParams({ fromString: params }) });
  }

  public getTemplateList(params: any): Observable<any> {
    return this.http.get('api/DpCorrelation', {params: new HttpParams({fromObject: params})});
  }

  public getTemplate(params: any): Observable<any> {
    return this.http.get('api/DpTaskSheetTemplate', {params: new HttpParams({fromObject: params})});
  }

  public getTemplates(params: string): Observable<any> {
    return this.http.get('api/DpTaskSheetTemplate', { params: new HttpParams({ fromString: params })});
  }

  public editTemplate(template: TaskSheetTemplate): Observable<any> {
    return this.http.post('api/DpTaskSheetTemplate', template);
  }

  public editTaskSheet(taskSheet: TaskSheet): Observable<any> {
    return this.http.post('api/DpTaskSheet', taskSheet);
  }

}
