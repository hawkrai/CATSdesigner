export class ComplexMonitoring {
  Name?: string
  ParentId?: string
  Estimated?: number
  EstimatedSeconds?: number
  EstimatedMinutes?: number
  WatchingTime?: number
  WatchingTimeSeconds?: number
  WatchingTimeMinutes?: number
  Children?: ComplexMonitoring[]
  Conteiner?: string
  IsGroup?: boolean
  SubjectName?: string
  Color?: string
}
