import { INewsState, initialNewsState } from './../state/news.state';
import { createReducer, on } from '@ngrx/store';
import * as newsActinos from '../actions/news.actions';

export const newsReducers = createReducer(
  initialNewsState,
  on(newsActinos.loadNewsSuccess, (state, action): INewsState => ({
    ...state,
    news: action.news
  })),
  on(newsActinos.setSelectedNews, (state, action): INewsState => ({
    ...state,
    selectedNews: action.news
  }))
);

// export const newsReducers = (state = initialNewsState, action: NewsActions): INewsState => {
//   switch (action.type) {
//     case ENewsActions.SET_NEWS: {
//       return {
//         ...state,
//         newsList: action.payload
//       };
//     }
//     case ENewsActions.CREATE_NEWS: {
//       const arrayClone = JSON.parse(JSON.stringify(state.newsList));
//       return {
//         ...state,
//         newsList: [action.payload, ...arrayClone]
//       }
//     }
//     case ENewsActions.UPDATE_NEWS: {
//       const arrayClone = JSON.parse(JSON.stringify(state.newsList));
//       const index = arrayClone.findIndex(item => item.id === action.payload.id);
//       arrayClone[index] = action.payload;

//       return {
//         ...state,
//         newsList: arrayClone
//       }
//     }
//     case ENewsActions.DELETE_NEWS_BY_ID: {
//       const arrayClone = JSON.parse(JSON.stringify(state.newsList));
//       const index = arrayClone.findIndex(item => item.id === action.payload);
//       arrayClone.splice(index, 1);

//       return {
//         ...state,
//         newsList: arrayClone
//       }
//     }
//     default:
//       return state;
//   }
// };
