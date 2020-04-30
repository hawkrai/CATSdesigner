export class Group {
  countUnconfirmedStudents: number;
  groupId: string;
  groupName: string;
  lecturesMarkVisiting: string;
  scheduleProtectionPracticals: [];
  students: [];
  subGroupsOne: SubGroup;
  subGroupsTwo: SubGroup;
  subGroupsThird: SubGroup;
}

export class SubGroup {
  groupId: string;
  labs: [];
  name: string;
  scheduleProtectionLabs: [];
  scheduleProtectionLabsRecomendMark: string;
  students: [];
  subGroupId: string;
}
