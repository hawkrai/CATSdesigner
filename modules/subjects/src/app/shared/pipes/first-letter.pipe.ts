import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'firstLetter',
})
export class FirstLetterPipe implements PipeTransform {
  transform(value: any, addDot: boolean = true) {
    if (value) {
      return value[0] + (addDot ? '.' : '')
    }
    return ''
  }
}
