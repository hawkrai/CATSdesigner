import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import { Observable } from 'rxjs';
import {Professor, EditProfessor, AddProfessor} from '../model/professor';

@Injectable({
    providedIn: 'root'
})
export class ProfessorService {

    api = '/Administration/';

    constructor(private http: HttpClient) {
    }

    getProfessorById(professorId): Observable<Professor> {
        return this.http.get<Professor>(this.api + 'GetProfessorJson/' + professorId);
    }

    getProfessorByName(userName): Observable<Professor> {
        return this.http.get<Professor>(this.api + 'GetProfessorByNameJsonAsync/?userName=' + userName);
    }

    getProfessors(): Observable<Professor[]> {
        return this.http.get<Professor[]>(this.api + 'GetProfessorsJson');
    }

    addProfessor(professor: AddProfessor) {
        return this.http.post(this.api + 'AddProfessorJson', professor);
    }

    editProfessor(professor): Observable<EditProfessor> {
        return this.http.post<EditProfessor>(this.api + 'SaveProfessorJson', professor);
    }

    deleteProfessor(professorId): Observable<void> {
        return this.http.get<void>(this.api + 'DeleteLecturerJson/' + professorId);
    }

}
