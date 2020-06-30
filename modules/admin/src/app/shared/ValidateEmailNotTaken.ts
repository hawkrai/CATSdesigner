import {AbstractControl, ValidationErrors} from '@angular/forms';
import {AccountService} from '../service/account.service';
import {Observable, of} from 'rxjs';
import {debounceTime, distinctUntilChanged, map, switchMapTo, take, tap} from 'rxjs/operators';

export class ValidateEmailNotTaken {
  static createValidator(accountService: AccountService) {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.valueChanges || control.pristine) {
        return of(null);
      } else {
        return control.valueChanges.pipe(
          debounceTime(300),
          distinctUntilChanged(),
          take(1),
          switchMapTo(accountService.usersExist(control.value.toLowerCase())),
          tap(() => control.markAsTouched()),
          map((data) => (data ? { userExist: true } : null))
        );
      }
    };
  }
}
