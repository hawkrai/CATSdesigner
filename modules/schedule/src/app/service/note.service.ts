import { Injectable } from '@angular/core';
import {Observable, of} from 'rxjs';
import {Note} from '../model/note.model';
import {NOTES} from '../mock/note-mock';
import {NoteAdd} from '../model/noteAdd.model';
import {HttpClient} from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class NoteService {

  constructor(private http: HttpClient) { }

  getNotes(): Observable<Note[]> {
    return of(NOTES);
  }

  savePersonalNote(noteAdd: NoteAdd): Observable<any> {
    return this.http.post<any>('/Services/Notes/NotesService.svc/SavePersonalNote', {note: noteAdd});
  }

  deletePersonalNote(idNote: number): Observable<any> {
    return this.http.post<any>('/Services/Notes/NotesService.svc/DeletePersonalNote', {id: idNote});
  }

  getPersonalNotes(): Observable<any> {
    return this.http.get<any>('/Services/Notes/NotesService.svc/GetPersonalNotes');
  }
}
