import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'isInteger'
})
export class IsIntegerPipe implements PipeTransform {

    transform(value: number) {
        return Number.isInteger(value);
    }

}