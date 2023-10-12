export class GroupStatsStatistic {
  Code: string
  Message: string
  GroupName: string
  Students: GroupStatsStudent[]
}

export class GroupStatsStudent {
  FIO: string
  Id: number
  Rating: number
  UserAvgLabMarks: StatsValue[]
  UserAvgTestMarks: StatsValue[]
  UserLabCount: StatsValue[]
  UserLabPass: StatsValue[]
  UserLecturePass: StatsValue[]
  UserTestCount: StatsValue[]
  UserPracticalPass: StatsValue[]
  UserPracticalCount: StatsValue[]
  UserAvgPracticalMarks: StatsValue[]
}

export class StatsValue {
  Key: number
  Value: number
}
