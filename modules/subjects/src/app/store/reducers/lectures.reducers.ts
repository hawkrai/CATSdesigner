import {initialLecturesState, LecturesState} from '../state/lectures.state';
import {ELecturesActions, LecturesActions} from '../actions/lectures.actions';

export const lecturesReducers = (state = initialLecturesState, action: LecturesActions): LecturesState => {
  switch (action.type) {
    case ELecturesActions.SET_LECTURE_CALENDAR:
      return {
        ...state,
        calendar: action.payload
      };

    default:
      return state;
  }

};
