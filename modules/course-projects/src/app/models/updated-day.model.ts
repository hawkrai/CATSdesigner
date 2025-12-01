export interface UpdatedDay {
  Id: number
  Day: string
  StartTime: string
  EndTime: string
  Building: string
  Audience: string
  GroupId: number
  Subject: {
    Id: number
  }
  Teacher: {
    LectorId: number
    FullName: string
    UserName: string
  }
}
