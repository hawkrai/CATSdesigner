import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class LibreOfficeAvailabilityService {
  private readonly availability$ = new BehaviorSubject<boolean>(false);
  private initialized = false;

  constructor(private http: HttpClient) {}

  get isAvailable(): boolean {
    return this.availability$.getValue();
  }

  private loadAvailability(): Observable<boolean> {
    return this.http
      .get<{ IsLibreOfficeAvailable: boolean }>(
        '/Services/Concept/ConceptService.svc/CheckLibreOfficeAvailability'
      )
      .pipe(
        map(res => res.IsLibreOfficeAvailable),
        catchError(() => of(false)),
        tap(available => {
          this.initialized = true;
          this.availability$.next(available);
        })
      );
  }

  getAvailability(): Observable<boolean> {
    if (!this.initialized) {
      this.loadAvailability().subscribe();
    }
    return this.availability$.asObservable();
  }

  resolveAvailability(): Observable<boolean> {
    return this.initialized ? of(this.isAvailable) : this.loadAvailability();
  }
}
