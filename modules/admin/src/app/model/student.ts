export class Student {
    Avatar: any;
    Name: string;
    Surname: string;
    Patronymic: string;
    UserName: string;
    IsPasswordReset: boolean;
    Password: string;
    ConfirmPassword: string;
    GroupId: number;
    Group: string;
    Email: string;
    IsActive: boolean;
    DeletedOn: string;
    Id: number;
    FullName: string;
    SkypeContact: string;
    Phone: string;
    About: string;
    LastLogin: string;
    Confirmed: boolean;
    ConfirmedBy: string;
    ConfirmationDate: string;
    AddedOn: string;
}

export class EditStudent {
    Avatar: any;
    Name: string;
    Surname: string;
    Patronymic: string;
    UserName: string;
    Group: string;
    Email: string;
    IsActive: boolean;
    Id: number;
    SkypeContact: string;
    Phone: string;
    About: string;
}

export class StudentByGroup {
    Students: Students[];
}

export class Students {
    Confirmed: boolean;
    FullName: string;
    GroupId: number;
    LabVisitingMark: string;
    LabsMarkTotal: string;
    Login: string;
    PracticalMarkTotal: string;
    PracticalVisitingMark: string;
    StudentId: number;
    StudentLabMarks: string;
    StudentPracticalMarks: string;
    SubgroupId: string;
    TestMark: string;
}

export class RegisterModel {
  Name: string;
  Surname: string;
  Patronymic: string;
  UserName: string;
  Password: string;
  ConfirmPassword: string;
  Group: string;
  Answer: string;
  QuestionId: string;
}
