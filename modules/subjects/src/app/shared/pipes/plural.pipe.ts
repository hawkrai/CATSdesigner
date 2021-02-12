import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'plural'
})
export class PluralPipe implements PipeTransform {
  transform(value: number, plurForm: string, singularForm: string): string {
    return value > 1 ? singularForm : plurForm;
  }
}
