import { createFeatureSelector, createSelector } from '@ngrx/store'
import { IAppState } from '../state/app.state'
import { ITestsState } from '../state/tests.state'

const testsSelector = createFeatureSelector<IAppState, ITestsState>('tests')

export const getTestsCount = createSelector(
  testsSelector,
  (state) => state.testsCount
)
