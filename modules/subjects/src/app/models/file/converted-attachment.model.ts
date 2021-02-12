import { AttachmentType } from "./attachment.model";

export class ConvertedAttachment {
    id: number;
    name: string; 
    pathName: string;
    fileName: string;
    attachmentType: AttachmentType;
}