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
  includeLabs?: boolean | null
  includeLectures?: boolean | null
  includeWorkshops?: boolean | null
  includeTests?: boolean | null

  url?: string

  isNew?: boolean

  nodeId?: string

  attachments?: any[]
  documents?: string[]
  currentIndex?: number
  
  //Adaptive Learning
  isAdaptive?: boolean
  adaptivityType?: number
  adaptivity?: Adaptivity

  isGroup?: boolean
  parentId?: number
  testId?: number
  isMandatoryComponent?: boolean
  children?: any[]
}
