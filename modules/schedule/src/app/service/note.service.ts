import { Injectable } from '@angular/core';
import {Observable, of} from 'rxjs';
import {Note} from '../model/note.model';
import {NOTES} from '../mock/note-mock';


@Injectable({
  providedIn: 'root'
})
export class NoteService {

  constructor() { }

  getNotes(): Observable<Note[]> {
    return of(NOTES);
  }
}
