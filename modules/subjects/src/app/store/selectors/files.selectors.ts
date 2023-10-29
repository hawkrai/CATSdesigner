import { IFilesState } from './../state/files.state'
import { createFeatureSelector, createSelector } from '@ngrx/store'
import { IAppState } from '../state/app.state'

const filesSelector = createFeatureSelector<IAppState, IFilesState>('files')

export const getFiles = createSelector(filesSelector, (state) => state.files)

export const isDownloading = createSelector(
  filesSelector,
  (state) => state.isDownloading
)
