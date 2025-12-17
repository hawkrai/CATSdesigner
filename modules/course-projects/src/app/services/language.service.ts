import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private language$ = new BehaviorSubject<'ru' | 'en'>(this.getStoredLanguage());

  private getStoredLanguage(): 'ru' | 'en' {
    const lang = localStorage.getItem('locale');
    return lang === 'en' ? 'en' : 'ru';
  }

  get current(): 'ru' | 'en' {
    return this.language$.value;
  }

  observe() {
    return this.language$.asObservable();
  }

  set(lang: 'ru' | 'en') {
    localStorage.setItem('locale', lang);
    this.language$.next(lang);
  }
}
