import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Student, EditStudent } from '../model/student';
import { Observable } from 'rxjs';
import { UserActivity } from '../model/userActivity';

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
}
