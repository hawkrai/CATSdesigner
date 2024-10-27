import { Adaptivity } from './Adaptivity'

export interface DialogData {
  width?: string
  title?: string
  body?: any
  buttonText?: string
  model?: any
  id?: string

  name?: string
  subjectName?: string

  isPublished?: boolean
  includeLabs?: boolean
  includeLecturers?: boolean
  includeWorkshops?: boolean
  includeTests?: boolean

  url?: string

  isNew?: boolean

  nodeId?: string

  attachments?: any[]
  documents?: string[]

  //Adaptive Learning
  isAdaptive?: boolean
  adaptivityType?: number
  adaptivity?: Adaptivity

  isGroup?: boolean
  parentId?: number
}
