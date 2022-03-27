export class ProfileProject {
    Name?: string;
    SubjectName?: string;
    IsArchived?;
}

export class ProfileInfoSubject {
  Name?: string;
  Id?: number;
  ShortName?: string;
  Color?: string;
  Completing?: number;
  IsActive?: boolean;
}

export class ProfileInfo {
  Id?: number;
  Name?: string;
  UserType?: string;
  Skill?: string;
  SkypeContact?: string;
  Email?: string;
  Phone?: string;
  About?: string;
  Avatar?: string;
  LastLogitData?: string;
  Group?: string;
  GroupId?: number;
  Login?: string;
}

export class ProfileModel {
  Id!: string;
}
