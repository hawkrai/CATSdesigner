export class FileResponse {
  Code: string
  DataD: string
  Message: string
  Files: ViewFile[]
}

export class File {
  Id: number
  AttachmentType: number
  FileName: string
  Name: string
  PathName: string
  CreationDateString: string
  DateTime: string
  AuthorName: string
}

export class ViewFile {
  Id: number
  AttachmentType: number
  FileName: string
  Name: string
  PathName: string
  CreationDateString: string
  DateTime: string
  AuthorName: string
  FileSize: number
}
