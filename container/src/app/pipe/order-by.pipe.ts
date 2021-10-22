import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderBy'
})
export class OrderByPipe implements PipeTransform {

  transform(arr: any[], field: string = null, desc = false): any[] {
    if (field) {
        if (arr.length && !Object.keys(arr[0]).includes(field)) {
            throw new Error();
        }
        const sort = [...arr].sort((a, b) => a[field] > b[field] ? 1 : -1);
        return desc ? sort.reverse() : sort;
    }
    const sort = [...arr].sort((a, b) => a > b ? 1 : -1);
    return  desc ? sort.reverse() : sort;
}

}
