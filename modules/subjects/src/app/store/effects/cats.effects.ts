import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { map, tap } from 'rxjs/operators'
import { CatsMessageService } from 'src/app/services/cats.message'
import { Message } from '../../../../../../container/src/app/core/models/message'
import { TranslatePipe } from 'educats-translate'
import * as catsActions from '../actions/cats.actions'
import { KnownMessage, translationKeyMapping } from '../message-mappings'

@Injectable()
export class CatsEffects {
  constructor(
    private catsMessageService: CatsMessageService,
    private translatePipe: TranslatePipe,
    private actions$: Actions
  ) {}

  sendMessage = createEffect(
    () =>
      this.actions$.pipe(
        ofType(catsActions.sendMessage),
        tap(({ message }) => {
          const parsedValue = JSON.parse(message.Value)
          const translationKey =
            translationKeyMapping[parsedValue.text as KnownMessage]
          if (translationKey) {
            parsedValue.text = this.translatePipe.transform(
              translationKey,
              parsedValue.text
            )
            message.Value = JSON.stringify(parsedValue)
          }
          this.catsMessageService.sendMessage(message)
        })
      ),
    { dispatch: false }
  )

  setupMessageCommunication = createEffect(
    () =>
      this.actions$.pipe(
        ofType(catsActions.setupMessageCommunication),
        tap(() => this.catsMessageService.setupMessageCommunication())
      ),
    { dispatch: false }
  )

  showMessage = createEffect(() =>
    this.actions$.pipe(
      ofType(catsActions.showMessage),
      map(({ body }) => {
        const message = new Message()
        message.Type = 'Toast'
        message.Value = JSON.stringify({
          text: body.Message as string,
          type: body.Code === '200' ? 'success' : 'warning',
        })
        return catsActions.sendMessage({ message })
      })
    )
  )
}
