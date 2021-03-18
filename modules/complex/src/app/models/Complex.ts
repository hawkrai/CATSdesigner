export class Complex {
  constructor(_name: string, _container: string, _subjectId: number) {
    this.name = _name;
    this.container = _container;
    this.subjectId = _subjectId;
  }

  name?: string;

  container?: string;
  subjectId?: number;

  isPublished?: boolean;

  includeLabs?: boolean;
  includeLectures?: boolean;
  includeTests?: boolean;

  elementId?: number; 
}
