import { AttachedFile } from './../../models/file/attached-file.model';

export interface IFilesState {
    files: AttachedFile[],
    isDownloading: boolean
}

export const filesInitialState: IFilesState = {
    files: [],
    isDownloading: false
}