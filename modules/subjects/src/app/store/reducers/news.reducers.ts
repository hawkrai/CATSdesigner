import {initialSubjectState, ISubjectState} from "../state/subject.state";
import {ESubjectActions, SubjectActions} from "../actions/subject.actions";
import {INewsState, initialNewsState} from "../state/news.state";
import {ENewsActions, NewsActions} from "../actions/news.actions";

export const newsReducers = (
  state = initialNewsState,
  action: NewsActions
): INewsState => {
  switch (action.type) {
    case ENewsActions.SetNews: {
      return {
        ...state,
        newsList: action.payload
      };
    }
    default:
      return state;
  }
};
