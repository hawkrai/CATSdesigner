import { Pipe, PipeTransform } from '@angular/core';
import { StudentMark } from 'src/app/models/student-mark.model';

@Pipe({
  name: 'isNotAll'
})
export class ResultPipe implements PipeTransform {

  transform(value: StudentMark): boolean {
    return value.PracticalsMarks.filter(mark => mark.Mark).length !== value.PracticalsMarks.length;
  }
}
