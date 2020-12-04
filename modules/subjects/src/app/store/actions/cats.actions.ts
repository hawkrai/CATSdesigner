import { Message } from './../../../../../../container/src/app/core/models/message';
import { createAction, props } from '@ngrx/store';

export const sendMessage = createAction(
    '[Cats] Send Message',
    props<{ message: Message }>()
);