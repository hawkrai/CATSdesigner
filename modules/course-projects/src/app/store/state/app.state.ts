import {initialSubjectState, ISubjectState} from './subject.state';


export interface IAppState {
  subject: ISubjectState;
}

export const initialAppState: IAppState = {
  subject: initialSubjectState
};

export function getInitialState(): IAppState {
  return initialAppState;
}
