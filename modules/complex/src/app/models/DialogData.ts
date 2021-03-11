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

  includeLabs?: boolean;
  includeLectures?: boolean;
  includeTests?: boolean;

  url?: string;

  isNew?: boolean;

  nodeId?: string;

  attachments?: any[];

  //Adaptive Learning
  isAdaptive?: boolean;
  adaptivityType?: number;
  adaptivity?: Adaptivity;

  isGroup?: boolean;
  parentId?: number;
}
