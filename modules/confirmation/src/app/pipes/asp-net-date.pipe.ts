import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'aspNetDate'
})
export class AspNetDatePipe implements PipeTransform {
    transform(value: any): Date {
        const re = /-?\d+/;
        const m = re.exec(value);
        return new Date(parseInt(m[0], 10));
    }
}