import {FormControl} from '@angular/forms';

export const validateDate = (control: FormControl) => {
  const isInvalidDate = Number.isNaN(Date.parse(control.value));
  if (isInvalidDate) {
    return { valid: false }
  }
  return new Date(control.value) > new Date() ? { valid: false } : null;
}
