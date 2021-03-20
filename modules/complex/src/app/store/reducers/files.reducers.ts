import { Action, createReducer, on } from '@ngrx/store';
import { filesInitialState, IFilesState } from './../states/files.state';
import * as filesActions from '../actions/files.actions';

const fileReducer =  createReducer(
    filesInitialState,
    on(filesActions.loadAttachmentsSuccess, (state, { files }): IFilesState => ({
      ...state,
      files
    })),
    on(filesActions.reset, (state): IFilesState => ({
      ...state,
      files: []
    })),
    on(filesActions.addFile, (state): IFilesState => ({
      ...state,
      files: [...state.files, null]
    })),
    on(filesActions.addFileSuccess, (state, { file, index }): IFilesState => ({
      ...state,
      files: state.files.map((f, i) => i === index ? file : f)
    })),
    on(filesActions.deleteFileSuccess, (state, { guidFileName }): IFilesState => ({
      ...state,
      files: state.files.filter(file => file.GuidFileName !== guidFileName)
    }))
);

export function filesReducer(state: IFilesState, action: Action) {
  return fileReducer(state, action);
}


