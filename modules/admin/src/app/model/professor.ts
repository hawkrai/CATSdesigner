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
}

export class EditProfessor {
    LecturerId: number;
    Avatar: string;
    SkypeContact: string;
    Phone: string;
    Skill: string;
    About: string;
    Name: string;
    Surname: string;
    Patronymic: string;
    Username: string;
    Email: string;
    IsActive: boolean;
    IsSecretary: boolean;
    IsLecturerHasGraduateStudents: boolean;
    SeletectedGroupIds: string[];
}
