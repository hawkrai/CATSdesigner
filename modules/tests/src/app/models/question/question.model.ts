import {Answer} from './answer.model';

export class Question {
  QuestionNumber?: any;
  Test?: any;
  TestId?: number;
  Title?: string;
  Description?: any;
  ComlexityLevel?: number;
  ComplexityLevel?: number;
  ConceptId?: any;
  QuestionType?: number;
  Answers?: Answer[];
  ConceptQuestions?: any;
  Id?: number;
  IsNew?: boolean;
  Action?: any;
  Number?: number;
  Selected?: boolean;
  questionItems?: number[];
  testId?: string;
}
