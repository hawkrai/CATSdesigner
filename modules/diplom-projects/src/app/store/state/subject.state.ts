export interface ISubjectState {
  subjectId: string;
}

export const initialSubjectState: ISubjectState = {
  // subjectId: JSON.parse(localStorage.getItem("currentSubject")).id
    subjectId: "2"
};
