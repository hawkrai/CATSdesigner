import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'orderBy'
})
export class OrderByPipe implements PipeTransform {

    transform(arr: any[], field: string, desc = false): any[] {
        if (field) {
            const sort = arr.sort((a, b) => a[field] > b[field] ? 1 : -1);
            return desc ? sort.reverse() : sort;
        }
        const sort = arr.sort((a, b) => a > b ? 1 : -1);
        return  desc ? sort.reverse() : sort;
    }

}