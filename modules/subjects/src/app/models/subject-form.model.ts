export class SubjectForm {
    DisplayName: string;
    ShortName: string;
    Title: string;
    Groups: SubjectGroup[];
    SubjectId: number;
    Color: string;
    SelectedGroups: number[];
} 

export class SubjectModule {
    Name: string;
    ModuleId: number;
    Checked: boolean;
    Type: number;
}

export class SubjectGroup {
    Text: string;
    Value: string;
}