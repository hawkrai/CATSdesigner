import { Group } from './group';

export class Professor {
    FullName: string;
    Username: string;
    LastLogin: string;
    Subjects: string;
    IsActive: boolean;
    DeletionDate: string;
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
    SecretaryGroupsIds: string[];
    QuestionId: string;
    Answer: string;
    RegistrationDate: string;
}

export class AddProfessor  {
  Name: string;
  Surname: string;
  Patronymic: string;
  UserName: string;
  IsLecturerHasGraduateStudents: boolean;
  IsSecretary: boolean;
  SelectedGroupIds: string[];
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
    SelectedGroupIds: string[];
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
