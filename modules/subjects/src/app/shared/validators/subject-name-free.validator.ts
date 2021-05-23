import { Directive, Input } from "@angular/core";
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from "@angular/forms";
import { Subject } from "src/app/models/subject.model";

@Directive({
  selector: '[subjectNameFree]',
  providers: [{provide: NG_VALIDATORS, useExisting: SubjectNameFreeDirective, multi: true}]
})
export class SubjectNameFreeDirective implements Validator {
  @Input('subjectNameFree') subjects: Subject[] = [];
  @Input() subjectId?: number;

  validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value ? control.value.toLowerCase() : control.value;

    return this.subjects.some(x => x.DisplayName.toLowerCase() === value && x.SubjectId !== this.subjectId) ? { subjectNameFree: true } : null;
  }

}

