import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'pluck',
})
export class PluckPipe implements PipeTransform {
  transform(array: any[], key: string) {
    return array.map((v) => v[key])
  }
}
