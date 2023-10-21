import { IAppState } from '../state/app.state'
import { subjectReducer } from './subject.reducer'
import { ActionReducerMap } from '@ngrx/store'
import { newsReducer } from './news.reducer'
import { groupsReducer } from './groups.reducer'
import { lecturesReducer } from './lectures.reducer'
import { labsReducer } from './labs.reducer'
import { practicalsReducer } from './practicals.reducer'
import { filesReducer } from './files.reducer'
import { testsReducer } from './tests.reducer'

export const appReducers: ActionReducerMap<IAppState, any> = {
  subject: subjectReducer,
  news: newsReducer,
  groups: groupsReducer,
  lectures: lecturesReducer,
  labs: labsReducer,
  practicals: practicalsReducer,
  files: filesReducer,
  tests: testsReducer,
}
