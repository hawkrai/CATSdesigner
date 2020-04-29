export class FileResponse {
    Code: string;
    DataD: string;
    Message: string;
    Files: File[];
}

export class File {
    Id: number;
    AttachmentType: number;
    FileName: string;
    Name: string;
    PathName: string;
}
