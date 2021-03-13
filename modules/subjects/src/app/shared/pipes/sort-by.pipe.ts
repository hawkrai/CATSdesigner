import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'sortBy'
})
export class SortByPipe implements PipeTransform {

    transform(values: any[], field: string): any[] {
        return values.sort((a, b) => a[field] < b[field] ? -1 : 1);
    }

}