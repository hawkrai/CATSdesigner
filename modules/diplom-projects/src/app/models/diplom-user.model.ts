export class DiplomUser {
  UserId: string
  IsStudent: boolean
  IsLecturer: boolean
  IsSecretary: boolean
  HasChosenDiplomProject: boolean
  HasAssignedDiplomProject: boolean
  IsLecturerHasGraduateStudents: boolean
  StudentGroupId: number
  SelectedGroupIds: number[]
  LecturerGroupIds: number[]
}
