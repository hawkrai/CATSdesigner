import { ThemaStudyResult } from './ThemaStudyResult'

export class Adaptivity {
  nextThemaId: string
  nextMaterialPaths: string[]
  needToDoPredTest: boolean
  shouldWaitPresettedTime: boolean
  timeToWait?: number
  isLearningEnded: boolean
  learnedThemas: ThemaStudyResult[] = []
  isAccessDenied: boolean
  canRestartLearning: boolean
}
