import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'filterSubGroup'
})
export class FilterPipe implements PipeTransform {
  transform(values: any[], ...args: [string, number]): any {
    return values.filter(value => value[args[0]] === args[1]);
  }

}
