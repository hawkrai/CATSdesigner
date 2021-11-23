import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'startWith'
})
export class StartWithPipe implements PipeTransform {
    transform(value: string, str: string): boolean {
        return value.startsWith(str);
    }

}