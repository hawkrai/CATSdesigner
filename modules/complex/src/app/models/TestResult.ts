import { UserAnswer } from './question/UserAnswer'

export class TestResult {
  answers: UserAnswer[] = []
  mark: number
  percent: number
  startTime: Date
  endTime: Date
}
