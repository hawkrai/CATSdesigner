import { Injectable } from '@angular/core'
import { TranslatePipe } from 'educats-translate'

@Injectable({
  providedIn: 'root',
})
export class ConfirmationTranslateService {
  constructor(private translatePipe: TranslatePipe) {}

  transform(key: string, defaultValue: string): string {
    return this.translatePipe.transform(key, defaultValue)
  }
}
