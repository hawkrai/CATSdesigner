export class Attachment {
  Id: number;
  Name: string;
  FileName: string;
  PathName: string;
  AttachmentType: AttachmentType;
}


export enum AttachmentType {
  Audio, Video, Document, Image
}
