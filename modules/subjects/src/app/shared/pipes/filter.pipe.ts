import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(values: any[], key: string, value: any): any {
    return value === undefined || value === null ? values : values.filter(value => value[key] === value);
  }

}
