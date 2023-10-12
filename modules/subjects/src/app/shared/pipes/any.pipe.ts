import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'any',
})
export class AnyPipe implements PipeTransform {
  transform(array: any[], field: string = null): boolean {
    return array.some((v) => (field ? !!v[field] : !!v))
  }
}
