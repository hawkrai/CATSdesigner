import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private language$ = new BehaviorSubject<string>('ru'); 

  get current(): string {
    return this.language$.value;
  }

  set(language: string) {
    this.language$.next(language);
  }

  observe() {
    return this.language$.asObservable();
  }
}

