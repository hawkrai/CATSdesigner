import { createAction, props } from '@ngrx/store'
import { Protection } from 'src/app/models/protection.model'

export const protectionChanged = createAction(
  '[Protection] Changed',
  props<Protection>()
)

export const protectionReceived = createAction(
  '[Protection] Received',
  props<Protection>()
)
