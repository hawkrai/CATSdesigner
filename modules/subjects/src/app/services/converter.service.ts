import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConverterService {

  constructor() {
  }



  // public labToCreateEntity(lab: Lab): CreateEntity {
  //   const entity = new CreateEntity();
  //   entity.attachments = JSON.stringify(lab.attachments);
  //   entity.duration = lab.duration;
  //   entity.id = +lab.labId;
  //   entity.subjectId = lab.subjectId;
  //   entity.shortName = lab.shortName;
  //   entity.theme = lab.theme;
  //   entity.pathFile = lab.pathFile;
  //   entity.order = lab.order;
  //   return entity;
  // }

  // public practicalToCreateEntity(practical: Practical): UpdateLab {
  //   const entity = new UpdateLab();
  //   entity.Attachments = JSON.stringify(practical.Attachments);
  //   entity.Duration = practical.Duration;
  //   entity.Id = practical.PracticalId;
  //   entity.SubjectId = practical.SubjectId;
  //   entity.ShortName = practical.ShortName;
  //   entity.Theme = practical.Theme;
  //   entity.PathFile = practical.PathFile;
  //   entity.Order = practical.Order;
  //   return entity;
  // }

  // public practicalsUpdateConverter(labs: Practical[]): UpdateLab[] {
  //   return labs.map(p => this.practicalToCreateEntity(p));
  // }
}
