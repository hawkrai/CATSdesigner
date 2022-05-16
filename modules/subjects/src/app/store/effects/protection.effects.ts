import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import * as protectionActions from '../actions/protection.actions';
import { ProtectionService } from "src/app/services/protection.service";
import { filter, switchMap, withLatestFrom } from "rxjs/operators";
import { Store } from "@ngrx/store";
import * as subjectSelectors from '../selectors/subject.selector';
import * as groupsSelectors from '../selectors/groups.selectors';
import { IAppState } from "../state/app.state";
import * as labsActions from '../actions/labs.actions';
import * as practicalsActions from '../actions/practicals.actions';

@Injectable()
export class ProtectionEffects {

    constructor(
        private protectionService: ProtectionService,
        private actions$: Actions,
        private store: Store<IAppState>) { }

    protectionChanged$ = createEffect(() => this.actions$.pipe(
        ofType(protectionActions.protectionChanged),
        switchMap(body => this.protectionService.protectionChanged(body))
    ), { dispatch: false });

    protectionReceived$ = createEffect(() => this.actions$.pipe(
        ofType(protectionActions.protectionReceived),
        withLatestFrom(
            this.store.select(subjectSelectors.getUserId),
            this.store.select(subjectSelectors.getSubjectId),
            this.store.select(groupsSelectors.getCurrentGroupId)
        ),
        filter(([{ from, groupId, subjectId }, userId, currentSubjectId, currentGroupId]) => userId !== from && groupId === currentGroupId && subjectId === currentSubjectId),
        switchMap(([body]) => [labsActions.protectionChanged(body), practicalsActions.protectionChanged(body)])));
}