import { Lector } from './lector.model'

export class Student {
  StudentId: number
  FullNmae: string
  Confirmed: boolean
  ConfirmedAt?: Date
  ConfirmedBy: Lector
}
