export class Consultation {
  Id: string
  LecturerId: string
  Day: string
  SubjectId: string
  StartTime: string
  EndTime: string
  Building: string | number
  Audience: string
  isClose?: boolean
}
