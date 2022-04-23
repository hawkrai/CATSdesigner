import { createReducer, on } from "@ngrx/store";

import { initialTestsState, ITestsState } from "../state/tests.state";
import * as testsActions from '../actions/tests.actions';

export const testsReducer = createReducer(
    initialTestsState,
    on(testsActions.loadedTestsCount, (state, { testsCount}): ITestsState => ({
        ...state,
        testsCount
    }))
);