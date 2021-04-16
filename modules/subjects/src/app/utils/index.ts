import { Attachment, AttachmentType } from '../models/file/attachment.model';
import { AttachedFile } from '../models/file/attached-file.model';


export const attchedFileConverter = (attachedFile: AttachedFile): Attachment => {
    return ({ 
        Id: attachedFile.IdFile > 0 ? attachedFile.IdFile : 0 ,
        Name: attachedFile.Name, 
        AttachmentType: AttachmentType[attachedFile.Type], 
        PathName: '',
        FileName: attachedFile.GuidFileName});
};