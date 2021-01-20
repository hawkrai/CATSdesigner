import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'initials'
})
export class InitialsPipe implements PipeTransform {

    transform(name: string): string {
        const split = name.split(' ');
        return `${`${split[0][0].toUpperCase()}${split[0].slice(1)}`} ${split.slice(1).map(s => s[0].toUpperCase()).join('.')}.`;
    } 
}