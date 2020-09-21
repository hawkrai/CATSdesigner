import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'isAll'
})
export class ResultPipe implements PipeTransform {
  transform(value: any): any {
    return value.Marks.filter(mark => mark.Mark).length !== value.Marks.length;
  }

}
