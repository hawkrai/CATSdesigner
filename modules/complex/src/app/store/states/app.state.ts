import { initialSubjectState, ISubjectState } from "./subject.state";
import { filesInitialState, IFilesState } from './files.state';

export interface IAppState {
  subject: ISubjectState;
  files: IFilesState;
}

export const initialAppState: IAppState = {
  subject: initialSubjectState,
  files: filesInitialState
};

export function getInitialState(): IAppState {
  return initialAppState;
}
