import { Practical } from '../../models/practical.model';
export interface IPracticalState {
  practicals: Practical[];
}

export const initialPracticalsState: IPracticalState = {
  practicals: []
}

