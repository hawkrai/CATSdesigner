import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { CatsMessageService } from 'src/app/services/cats.message';

import * as catsActions from '../actions/cats.actions';
import { ToastService } from 'src/app/toast';

@Injectable()
export class CatsEffects {
    constructor(
        private catsMessageService: CatsMessageService,
        private actions$: Actions,
        private toastService: ToastService
    ) {}


    sendMessage = createEffect(() => this.actions$.pipe(
        ofType(catsActions.sendMessage),
        tap(({ message }) => this.catsMessageService.sendMessage(message))
    ), { dispatch: false });

    setupMessageCommunication = createEffect(() => this.actions$.pipe(
        ofType(catsActions.setupMessageCommunication),
        tap(() => this.catsMessageService.setupMessageCommunication())
    ), { dispatch: false });

    showMessage = createEffect(() => this.actions$.pipe(
        ofType(catsActions.showMessage),
        tap(({ body }) => {
            console.log(body);
            this.toastService.show({ text: body.Message as string, type: body.Code === '200' ? 'success' : 'warning' });
        }) 
    ), { dispatch: false })
}