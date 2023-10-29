import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'some',
})
export class SomePipe implements PipeTransform {
  transform(array: any[], value: any): boolean {
    return array.some((x) => x === value)
  }
}
