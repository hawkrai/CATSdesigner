import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'any'
})
export class AnyPipe implements PipeTransform {
    transform(array: any[], field: string): boolean {
        return array.some(v => !!v[field]);
    }
    
}