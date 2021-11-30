import { createAction, props } from '@ngrx/store';

export const downloadFile = createAction(
    '[Files] Download Files',
    props<{ pathName: string, fileName: string }>()
);

