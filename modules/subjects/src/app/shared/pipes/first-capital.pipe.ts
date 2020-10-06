import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'appFirstCapital'
})
export class FirstCapitalPipe implements PipeTransform {
  transform(input: string): string {
    return `${input.charAt(0).toUpperCase()}${input.slice(1).toLowerCase()}`;
  }
}
