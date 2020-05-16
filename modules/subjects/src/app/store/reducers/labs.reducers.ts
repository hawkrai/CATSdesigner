import {initialLabsState, LabsState} from '../state/labs.state';
import {ELabsActions, LabsActions} from '../actions/labs.actions';

export const labsReducers = (state = initialLabsState, action: LabsActions): LabsState => {
  switch (action.type) {
    case ELabsActions.SET_LABS:
      return {
        ...state,
        labs: action.payload
      };

    case ELabsActions.SET_LABS_CALENDAR:
      return {
        ...state,
        calendar: action.payload
      };

    default:
      return state
  }
};
