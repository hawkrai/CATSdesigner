import { IFilesState } from './../states/files.state'
import { createFeatureSelector, createSelector } from '@ngrx/store'
import { IAppState } from '../states/app.state'

const filesSelector = createFeatureSelector<IAppState, IFilesState>('files')

export const getFiles = createSelector(filesSelector, (state) => state.files)
