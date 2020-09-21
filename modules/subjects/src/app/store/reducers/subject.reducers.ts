import {initialSubjectState, ISubjectState} from "../state/subject.state";
import {ESubjectActions, SubjectActions} from "../actions/subject.actions";

export const subjectReducers = (
  state = initialSubjectState,
    action: SubjectActions
): ISubjectState => {
  switch (action.type) {
    case ESubjectActions.SET_SUBJECT: {
      return {
        ...state,
        subject: action.payload
      };
    }
    case ESubjectActions.SET_USER: {
      return {
        ...state,
        user: action.payload
      };
    }
    default:
      return state;
  }
};
