export class Group {
    Name!: string;
    StartYear!: string;
    GraduationYear!: string;
    StudentsCount!: number;
    Id!: number;
    IsNew!: boolean;
}

export class User{
  UserName!: string;
  SkypeContact!: string;
  Email!: string;
  Phone!: string;
  About!: string;
  Id!: number;
}

export class Student {
  FirstName!:string 
  MiddleName!:string;      
  LastName!:string;
  FullName!: string;
  User!: User;
  Group!: Group;
  GroupId!: number;
  Id!: number;
}

export class Lecturer {
  FirstName!:string 
  MiddleName!:string;      
  LastName!:string;
  FullName!: string;
  Skill!: string;
  User!: User;
  Id!: number;
  IsNew!: boolean;
}
