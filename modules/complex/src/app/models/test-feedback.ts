import { Test } from './Test'

export function isColorFeedbackTest(test: Test): boolean {
  return !!test && !!(test.ForSelfStudy || test.BeforeEUMK || test.ForEUMK)
}
