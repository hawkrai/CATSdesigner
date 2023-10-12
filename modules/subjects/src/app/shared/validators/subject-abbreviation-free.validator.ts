import { Directive, Input } from '@angular/core'
import {
  AbstractControl,
  AsyncValidator,
  NG_ASYNC_VALIDATORS,
  ValidationErrors,
} from '@angular/forms'
import { Observable } from 'rxjs'
import { debounceTime, map } from 'rxjs/operators'
import { SubjectService } from 'src/app/services/subject.service'

@Directive({
  selector: '[subjectAbbreviationFree]',
  providers: [
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: SubjectAbbreviationFreeDirective,
      multi: true,
    },
  ],
})
export class SubjectAbbreviationFreeDirective implements AsyncValidator {
  @Input('subjectAbbreviationFree') subjectId: number

  constructor(private subjectsService: SubjectService) {}

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    const value = control.value ? control.value.toLowerCase() : ''

    return this.subjectsService
      .isUniqueSubjectAbbreviation(value, this.subjectId ? this.subjectId : 0)
      .pipe(
        debounceTime(500),
        map(({ IsUnique }) =>
          IsUnique ? null : { subjectAbbreviationFree: true }
        )
      )
  }
}
