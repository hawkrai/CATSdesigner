import { Pipe, PipeTransform } from '@angular/core'
import * as moment from 'moment'

@Pipe({
  name: 'aspNetDate',
})
export class AspNetDatePipe implements PipeTransform {
  transform(value: any): Date {
    return moment(value).toDate()
  }
}
