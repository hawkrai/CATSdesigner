import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(arr: any[], key: string, value: any): any {
    return value === undefined || value === null ? arr : arr.filter(item => item[key] === value);
  }

}
