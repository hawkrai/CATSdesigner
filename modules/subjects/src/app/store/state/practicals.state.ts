import { Practical } from '../../models/practical.model';

export interface IPracticalsState {
  practicals: Practical[];
}

export const initialPracticalsState: IPracticalsState = {
  practicals: []
}

