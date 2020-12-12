import { Adaptivity } from "./Adaptivity";

export interface DialogData {
  width?: string;
  title?: string;  
  body?: any;
  buttonText?: string;
  model?: any;
  id?: string;

  name?: string;
  subjectName?: string;
  isPublished?: boolean;

  url?: string;

  isNew?: boolean;

  nodeId?: string;

  //Adaptive Learning
  isAdaptive?: boolean;
  adaptivityType?: number;
  adaptivity?: Adaptivity; 
}
