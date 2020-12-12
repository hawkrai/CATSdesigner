import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'unique'
})
export class UniquePipe implements PipeTransform {

    transform(array: any[], field: string) {
        return [...new Set(array.map(a => a[field]))];
    }
    
}