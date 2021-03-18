import { Message } from './../../models/message.model';
import { createAction, props } from '@ngrx/store';

export const sendMessage = createAction(
    '[Cats] Send Message',
    props<{ message: Message }>()
);

export const setupMessageCommunication = createAction(
    '[Cats] Setup Message Communication'
);

export const showMessage = createAction(
    '[Cats] Show Message',
    props<{ body: any }>()
);