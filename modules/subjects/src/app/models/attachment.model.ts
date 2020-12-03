export class Attachment {
  id: string;
  name: string;
  fileName: string;
  pathName?: string;
  attachmentType: AttachmentType;
}


export enum AttachmentType {
  Audio, Video, Document, Image
}