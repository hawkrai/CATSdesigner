import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Student } from '../model/student';
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

    editStudents(student): Observable<Student> {
        return this.http.post<Student>(this.api + 'EditStudent', student);
    }

    deleteStudent(studentId): Observable<void> {
        return this.http.delete<void>(this.api + 'DeleteStudentJson/' + studentId);
    }
}
