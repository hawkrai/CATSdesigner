import { Directive, Input } from "@angular/core";
import { AbstractControl, AsyncValidator, NG_ASYNC_VALIDATORS, ValidationErrors } from "@angular/forms";
import { Observable } from "rxjs";
import { debounceTime, map } from "rxjs/operators";
import { SubjectService } from "src/app/services/subject.service";

@Directive({
  selector: '[subjectNameFree]',
  providers: [{provide: NG_ASYNC_VALIDATORS, useExisting: SubjectNameFreeDirective, multi: true}]
})
export class SubjectNameFreeDirective implements AsyncValidator {
  @Input('subjectNameFree') subjectId: number;

  constructor(
    private subjectsService: SubjectService
  ) {}

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    const value = control.value ? control.value.toLowerCase() : '';
    return this.subjectsService.isUniqueSubjectName(value, this.subjectId ? this.subjectId : 0)
      .pipe(
        debounceTime(500),
        map(({ IsUnique }) => IsUnique ? null : { subjectNameFree: true })
      );
  }

}

