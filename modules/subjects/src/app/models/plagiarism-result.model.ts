export class PlagiarismResult {
    docs: string[];
    correctDocs: CorrectDoc[]
}

export class CorrectDoc {
    coeff: string;
    doc: string;
    author: string;
    subjectName: string;
    groupName: string;
    DocFileName: string;
    DocPathName: string;
}