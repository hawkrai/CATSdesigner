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
}
