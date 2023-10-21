import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'initials',
})
export class InitialsPipe implements PipeTransform {
  transform(name: string): string {
    const split = name.split(' ')
    if (split.length !== 3) {
      throw new Error('Incorrect data')
    }
    return `${`${split[0][0].toUpperCase()}${split[0]
      .slice(1)
      .toLowerCase()}`} ${split
      .filter((x) => !!x)
      .slice(1)
      .map((s) => (s[0] ? s[0].toUpperCase() : ''))
      .join('.')}.`
  }
}
