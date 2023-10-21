import { initialSubjectState, ISubjectState } from '../state/subject.state'
import { ESubjectActions, SubjectActions } from '../actions/subject.actions'

export const subjectReducers = (
  state = initialSubjectState,
  action: SubjectActions
): ISubjectState => {
  switch (action.type) {
    case ESubjectActions.SetSubjectId: {
      return {
        ...state,
        subjectId: action.payload,
      }
    }
    default:
      return state
  }
}
