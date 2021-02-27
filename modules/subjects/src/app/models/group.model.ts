export class Group {
  CountUnconfirmedStudents: number;
  GroupId: number;
  GroupName: string;
  LecturesMarkVisiting: string;
  ScheduleProtectionPracticals: [];
  Students: [];
  SubGroupsOne: SubGroup;
  SubGroupsTwo: SubGroup;
  SubGroupsThird: SubGroup;
}

export class SubGroup {
  GroupId: string;
  Labs: [];
  Name: string;
  ScheduleProtectionLabs: [];
  ScheduleProtectionLabsRecommendedMark: string;
  Students: [];
  SubGroupId: number;
}
