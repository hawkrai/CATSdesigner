import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { CatsMessageService } from 'src/app/services/cats.message';
import { Message } from '../../../../../../container/src/app/core/models/message';

import * as catsActions from '../actions/cats.actions';

@Injectable()
export class CatsEffects {
    constructor(
        private catsMessageService: CatsMessageService,
        private actions$: Actions
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
            const message = new Message();
            message.Type = 'Toast';
            console.log(body)
            message.Value = JSON.stringify({ text: body.Message as string, type: body.Code === '200' ? 'success' : 'warning' });
            this.catsMessageService.sendMessage(message);
        }) 
    ), { dispatch: false })
}