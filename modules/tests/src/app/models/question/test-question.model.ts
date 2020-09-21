import {Question} from './question.model';


export class TestQuestion {
  Question: Question;
  Number: number;
  Seconds: number;
  SetTimeForAllTest: boolean;
  ForSelfStudy: boolean;
  IncompleteQuestionsNumbers: number[];
}
