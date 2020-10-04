import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pluar'
})
export class PluarPipe implements PipeTransform {

  transform(value: number, plurForm: string, singularForm: string): string {
    return value > 1 ? singularForm : plurForm;
  }

}
