import { Lector } from "../../../../subjects/src/app/models/lector.model"

export class Consultation {
  Id: string
  Teacher: Lector
  Day: string
  Subject: any
  StartTime: string
  EndTime: string
  Building: string
  Audience: string
  isClose?: boolean
}
