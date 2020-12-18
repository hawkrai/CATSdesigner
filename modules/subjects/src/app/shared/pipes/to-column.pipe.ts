import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toColumn'
})
export class ToColumnPipe implements PipeTransform {

  transform(arr: any[], length: number = 1): any[] {
    if (length < 1) {
      throw new Error('Length must be positive');
    }
    const itemInColumn = Math.ceil(arr.length / length);
    const row = Array.from({ length })
      .map((_, index) => arr.slice(index * itemInColumn, index * itemInColumn + itemInColumn))
      .filter(arr => arr.length);
    
    return Array.from({ length: itemInColumn })
      .map((_, index) => row.map((_, i) => row[i][index]))
      .reduce((acc, v) => acc.concat(...v), []);
  }

}
