import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root',
})
export class NoteService {
  constructor(private http: HttpClient) {}

  savePersonalNote(
    noteAdd: any,
    dateNote: string,
    start: string,
    end: string,
    id:any
  ): Observable<any> {
    return this.http.post<any>(
      '/Services/Notes/NotesService.svc/SavePersonalNote',
      {
        text: noteAdd.title,
        date: dateNote,
        startTime: start,
        endTime: end,
        note: noteAdd.note,
        id:id
      }
    )
  }

  deletePersonalNote(idNote: number): Observable<any> {
    return this.http.post<any>(
      '/Services/Notes/NotesService.svc/DeletePersonalNote',
      { idNote }
    )
  }
  GetPersonalNotesBetweenDates(start: string, end: string): Observable<any> {
    return this.http.get<any>(
      '/Services/Notes/NotesService.svc/GetPersonalNotesBetweenDates?dateStart=' +
      start +
      '&dateEnd=' +
      end
    )
  }

  getPersonalNotes(): Observable<any> {
    return this.http.get<any>(
      '/Services/Notes/NotesService.svc/GetPersonalNotes'
    )
  }

  getTitle(title: string): any {
    const splitted = title.split('|', 2)
    return splitted[0]
  }

  getNote(title: string): any {
    const splitted = title.split('|', 2);
    return splitted[1] !== "null" ? splitted[1] : '';
  }
}
