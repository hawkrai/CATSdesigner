import { AttachedFile } from './../../models/file/attached-file.model';

export interface IFilesState {
    files: AttachedFile[]
}

export const filesInitialState: IFilesState = {
    files: []
}