import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'unique',
})
export class UniquePipe implements PipeTransform {
  transform(array: any[], field: string = null) {
    if (field && array.length && !Object.keys(array[0]).includes(field)) {
      throw new Error('Invalid field')
    }
    return [...new Set(field ? array.map((a) => a[field]) : array)]
  }
}
