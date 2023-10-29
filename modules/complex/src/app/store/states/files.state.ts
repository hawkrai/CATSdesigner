import { AttachedFile } from '../../models/AttachedFile'

export interface IFilesState {
  files: AttachedFile[]
}

export const filesInitialState: IFilesState = {
  files: [],
}
