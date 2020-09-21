import { Group } from './group';

export class Professor {
    FullName: string;
    Username: string;
    LastLogin: string;
    Subjects: string;
    IsActive: boolean;
    Id: number;
    Number: number;
    IsSecretary: boolean;
    IsLecturerHasGraduateStudents: boolean;
    Skill: string;
    Phone: string;
    About: string;
    SkypeContact: string;
    Password: string;
    ConfirmPassword: string;
    IsPasswordReset: boolean;
    Groups: Group[];
    Name: string;
    Surname: string;
    Patronymic: string;
    modForAdd: boolean;
    FirstName: string;
    LastName: string;
    MiddleName: string;
    Email: string;
    SeletectedGroupIds: string[];
    QuestionId: string;
    Answer: string;
}

export class AddProfessor  {
  Name: string;
  Surname: string;
  Patronymic: string;
  UserName: string;
  IsLecturerHasGraduateStudents: boolean;
  IsSecretary: boolean;
  Password: string;
  ConfirmPassword: string;
  QuestionId: string;
  Answer: string;
  Group: number;
}

export class EditProfessor {
    Name: string;
    Surname: string;
    Patronymic: string;
    UserName: string;
    IsActive: boolean;
    Email: string;
    SeletectedGroupIds: string[];
    Groups: [];
    LecturerId: number;
    IsLecturerHasGraduateStudents: boolean;
    IsSecretary: boolean;
    Avatar: string;
    SkypeContact: string;
    Phone: string;
    Skill: string;
    About: string;
}
