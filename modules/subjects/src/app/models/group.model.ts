export class Group {
  CountUnconfirmedStudents: number;
  GroupId: number;
  GroupName: string;
  LecturesMarkVisiting: string;
  ScheduleProtectionPracticals: [];
  Students: [];
  subGroupsOne: SubGroup;
  subGroupsTwo: SubGroup;
  subGroupsThird: SubGroup;
}

export class SubGroup {
  GroupId: string;
  Labs: [];
  Name: string;
  ScheduleProtectionLabs: [];
  ScheduleProtectionLabsRecomendMark: string;
  Students: [];
  SubGroupId: number;
}
