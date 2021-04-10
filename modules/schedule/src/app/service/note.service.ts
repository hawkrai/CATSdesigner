import { Injectable } from '@angular/core';
import {Observable, of} from 'rxjs';
import {Note} from '../model/note.model';
import {NoteAdd} from '../model/noteAdd.model';
import {HttpClient} from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class NoteService {

  constructor(private http: HttpClient) { }

  savePersonalNote(noteAdd: NoteAdd): Observable<any> {
    return this.http.post<any>('/Services/Notes/NotesService.svc/SavePersonalNote',
      {text: noteAdd.text, date: noteAdd.date, startTime: noteAdd.startTime,
            endTime: noteAdd.endTime, note: noteAdd.note});
  }

  deletePersonalNote(idNote: number): Observable<any> {
    return this.http.post<any>('/Services/Notes/NotesService.svc/DeletePersonalNote', {idNote});
  }

  getPersonalNotes(): Observable<any> {
    return this.http.get<any>('/Services/Notes/NotesService.svc/GetPersonalNotes');
  }

  getTitle(title: string): any {
    const splitted = title.split('|', 2);
    return splitted[0];
  }

  getNote(title: string): any {
    const splitted = title.split('|', 2);
    return splitted[1];
  }
}
