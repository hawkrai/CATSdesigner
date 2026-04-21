import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class LibreOfficeAvailabilityService {
  private readonly availability$ = new BehaviorSubject<boolean>(false);
  private initialized = false;

  constructor(private http: HttpClient) {}

  get isAvailable(): boolean {
    return this.availability$.getValue();
  }

  getAvailability(): Observable<boolean> {
    if (!this.initialized) {
      this.initialized = true;
      this.http
        .get<{ IsLibreOfficeAvailable: boolean }>(
          '/Services/Concept/ConceptService.svc/CheckLibreOfficeAvailability'
        )
        .pipe(
          map(res => res.IsLibreOfficeAvailable),
          catchError(() => of(false))
        )
        .subscribe(available => this.availability$.next(available));
    }
    return this.availability$.asObservable();
  }
}
