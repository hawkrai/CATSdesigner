import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import { Observable } from 'rxjs';
import { Professor, EditProfessor } from '../model/professor';

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

    getProfessors(): Observable<Professor[]> {
        return this.http.get<Professor[]>(this.api + 'GetProfessorsJson');
    }

    addProfessor(professor: Professor): Observable<Professor> {
        return this.http.post<Professor>(this.api + 'SaveProfessorJson/', professor);
    }

    editProfessor(professor): Observable<EditProfessor> {
        return this.http.post<EditProfessor>(this.api + 'EditProfessor', professor);
    }

    deleteProfessor(professorId): Observable<void> {
        return this.http.delete<void>(this.api + 'DeleteLecturerJson/' + professorId);
    }

}
