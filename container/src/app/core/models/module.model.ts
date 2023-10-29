export class Module {
  Name: string
  ModuleId: number
  Checked: boolean
  Type: ModuleType
}

export enum ModuleType {
  News = 1,
  Lectures = 2,
  Labs = 3,
  YeManagment = 4,
  SubjectAttachments = 5,
  LabAttachments = 6,
  Projects = 7,
  SmartTest = 8,
  Dsm = 9,
  ScheduleProtection = 11,
  Results = 12,
  StatisticsVisits = 13,
  Practical = 10,
  ComplexMaterial = 14,
  InteractiveTutorial = 15,
}
