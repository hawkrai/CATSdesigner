import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {

  constructor(private http: HttpClient) {
  }

  public editSubject(subjectId: string): Observable<any> {
    return this.http.get('Subject/EditSubject/' + subjectId);
  }

  public saveSubject(body): Observable<any> {
    return this.http.post('api/Subject/SaveSubject', body);
  }

  public editGroups(subjectId: string): Observable<any> {
    return this.http.get('Subject/SubGroups?subjectId=' + subjectId);
  }
}

