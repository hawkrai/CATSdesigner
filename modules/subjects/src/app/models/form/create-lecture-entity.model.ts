import { CreateEntity } from './create-entity.model';

export class CreateLectureEntity extends CreateEntity {
    theme: string; 
    duration: number; 
    order: number;
}

