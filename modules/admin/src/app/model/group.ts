export class Group {
    Name: string;
    StartYear: string;
    GraduationYear: string;
    StudentsCount: number;
    Id: number;
    Number: number;
}

export class LecturerGroup {
    Lecturer: string;
    Subjects: SubjectInfo[];
}

export class SubjectInfo {
    SubjectName: string;
    Groups: SubjectGroup[];
}

export class SubjectGroup {
    GroupName: string;
    StudentsCount: number;
}
