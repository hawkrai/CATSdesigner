import { createReducer, on } from '@ngrx/store'

import { filesInitialState, IFilesState } from './../state/files.state'
import * as filesActions from '../actions/files.actions'

export const filesReducer = createReducer(
  filesInitialState,
  on(
    filesActions.loadAttachmentsSuccess,
    (state, { files }): IFilesState => ({
      ...state,
      files,
    })
  ),
  on(
    filesActions.reset,
    (state): IFilesState => ({
      ...state,
      files: [],
    })
  ),
  on(
    filesActions.addFile,
    (state): IFilesState => ({
      ...state,
      files: [...state.files, null],
    })
  ),
  on(
    filesActions.addFileSuccess,
    (state, { file, index }): IFilesState => ({
      ...state,
      files: state.files.map((f, i) => (i === index ? file : f)),
    })
  ),
  on(
    filesActions.deleteFileSuccess,
    (state, { guidFileName }): IFilesState => ({
      ...state,
      files: state.files.filter((file) => file.GuidFileName !== guidFileName),
    })
  ),
  on(
    filesActions.setIsDownloading,
    (state, { isDownloading }): IFilesState => ({
      ...state,
      isDownloading,
    })
  )
)
