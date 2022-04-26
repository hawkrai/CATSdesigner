import { createAction, props } from "@ngrx/store";

export const loadedTestsCount = createAction(
    '[Tests] Loaded Tests Count',
    props<{ testsCount: number }>()
);