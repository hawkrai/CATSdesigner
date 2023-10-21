import { Directive } from '@angular/core'
import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
} from '@angular/forms'

@Directive({
  selector: '[whitespace]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: WhitespaceDirective, multi: true },
  ],
})
export class WhitespaceDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    return (control.value || '').trim().length === 0
      ? { whitespace: true }
      : null
  }
}

export const whitespace = (
  control: AbstractControl
): ValidationErrors | null => {
  return (control.value || '').trim().length === 0 ? { whitespace: true } : null
}
