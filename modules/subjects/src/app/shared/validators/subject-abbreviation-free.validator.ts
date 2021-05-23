import { Directive, Input } from "@angular/core";
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from "@angular/forms";
import { Subject } from "src/app/models/subject.model";

@Directive({
  selector: '[subjectAbbreviationFree]',
  providers: [{provide: NG_VALIDATORS, useExisting: SubjectAbbreviationFreeDirective, multi: true}]
})
export class SubjectAbbreviationFreeDirective implements Validator {
  @Input('subjectAbbreviationFree') subjects: Subject[] = [];
  @Input() subjectId?: number;

  validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value ? control.value.toLowerCase() : control.value;
    return this.subjects.some(x => x.Name.toLowerCase() === value && x.SubjectId !== this.subjectId) ? { subjectAbbreviationFree: true } : null;
  }
}