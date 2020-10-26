import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'firstLetterUppercase'
})
export class FirstLetterUppercasePipe implements PipeTransform {
    transform(input: string) {
        return input ? `${input[0].toUpperCase()}${input.slice(1).toLowerCase()}` : '';
    }
}