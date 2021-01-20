import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'width'
})
export class WidthPipe implements PipeTransform {
    transform(elem: HTMLElement): number {
       return elem.getBoundingClientRect().width;
    }
}