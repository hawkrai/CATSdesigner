import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export const STORAGE_KEYS = {
  LOCALE: 'locale',
} as const;

export const LANGUAGES = ['ru', 'en'] as const;

export type Language = typeof LANGUAGES[number];

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly language$ = new BehaviorSubject<Language>(
    this.getStoredLanguage()
  );

  private getStoredLanguage(): Language {
    const stored = localStorage.getItem(STORAGE_KEYS.LOCALE);
    return LANGUAGES.includes(stored as Language) ? (stored as Language) : 'ru';
  }

  get current(): Language {
    return this.language$.value;
  }

  observe(): Observable<Language> {
    return this.language$.asObservable();
  }

  set(lang: Language): void {
    localStorage.setItem(STORAGE_KEYS.LOCALE, lang);
    this.language$.next(lang);
  }
}