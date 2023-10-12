import { Pipe, PipeTransform } from '@angular/core'

export enum FilterOp {
  Eq = 'eq',
  Contains = 'contains',
  Neq = 'neq',
}

@Pipe({
  name: 'filter',
})
export class FilterPipe implements PipeTransform {
  transform(arr: any[], key: string, value?: any, filterOp?: FilterOp): any {
    return value === undefined || value === null
      ? arr
      : arr.filter((item) => this.getComparisonFn(filterOp)(value, item[key]))
  }

  getComparisonFn(filterOp?: FilterOp): (a: any, b: any) => boolean {
    switch (filterOp) {
      case FilterOp.Contains:
        return (a, b) => b.includes(a)
      case FilterOp.Eq:
        return (a, b) => a === b
      case FilterOp.Neq:
        return (a, b) => a !== b
      default:
        return (a, b) => a === b
    }
  }
}
