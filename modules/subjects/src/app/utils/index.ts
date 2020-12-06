import { Attachment } from '../models/file/attachment.model';


export const attachmentConverter = (attachment: Attachment) => ({  
    id: attachment.Id, 
    name: attachment.Name, 
    pathName: attachment.PathName, 
    fileName: attachment.FileName, 
    attachmentType: attachment.AttachmentType 
});