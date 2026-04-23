import { Action, createReducer, on } from '@ngrx/store'
import { filesInitialState, IFilesState } from './../states/files.state'
import * as filesActions from '../actions/files.actions'

const fileReducer = createReducer(
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
    (state, { file }): IFilesState => {
      const idx = state.files.indexOf(null)
      if (idx === -1) {
        return { ...state, files: [...state.files, file] }
      }
      const files = state.files.slice()
      files[idx] = file
      return { ...state, files }
    }
  ),
  on(
    filesActions.deleteFileSuccess,
    (state, { guidFileName }): IFilesState => ({
      ...state,
      files: state.files.filter((file) => file.GuidFileName !== guidFileName),
    })
  )
)

export function filesReducer(state: IFilesState, action: Action) {
  return fileReducer(state, action)
}
