import {Pipe, PipeTransform} from '@angular/core';
import { StudentMark } from 'src/app/models/student-mark.model';

@Pipe({
  name: 'isNotAll'
})
export class ResultPipe implements PipeTransform {
  transform(value: StudentMark): any {
    return value.LabsMarks.filter(mark => mark.Mark).length !== value.LabsMarks.length;
  }

}
