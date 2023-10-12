import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'find',
})
export class FindPipe implements PipeTransform {
  transform(array: any[], field: string, value: any): any {
    return array.find((o) => o[field] === value)
  }
}
