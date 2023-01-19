import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Student, EditStudent } from '../model/student';
import { Observable } from 'rxjs';
import { UserActivity } from '../model/userActivity';
import { Page } from '../model/page';

@Injectable({
    providedIn: 'root'
})
export class StudentService {

    api = '/Administration/';

    constructor(private http: HttpClient) {
    }

    getStudents(): Observable<Student[]> {
        return this.http.get<Student[]>(this.api + 'StudentsJson');
    }

    getStudentsPaged(pageIndex: number, pageSize: number, filter: string = null, orderBy: string = null, sortDirection: number = 0): Observable<Page<Student>> {
        let params = {
            'pageIndex': pageIndex.toString(),
            'pageSize': pageSize.toString()
        }

        if (filter != null && filter.trim() != '') {
            params['filter'] = filter;
        }

        if (orderBy != null && orderBy.trim() != '') {
            params['orderBy'] = orderBy;
            params['sortDirection'] = sortDirection.toString();
        }

        return this.http.get<Page<Student>>(this.api + 'GetStudentsPagedJsonAsync', {params: params});
    } 

    getStudentById(studentId): Observable<Student> {
        return this.http.get<Student>(this.api + 'GetStudentJson/' + studentId);
    }

    getStudentByName(userName): Observable<Student> {
        return this.http.get<Student>(this.api + 'GetStudentByNameJsonAsync/?userName=' + userName);
    }

    editStudents(student): Observable<EditStudent> {
        return this.http.post<Student>(this.api + 'EditStudentJson', student);
    }

    deleteStudent(studentId): Observable<void> {
        return this.http.get<void>(this.api + 'DeleteStudentJson/' + studentId);
    }

    restoreStudent(id): Observable<void> {
        return this.http.post<void>(this.api + 'RestoreStudentAsync', {id: id});
    }
}
