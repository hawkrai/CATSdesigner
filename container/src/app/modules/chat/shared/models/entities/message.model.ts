export interface Message {
  id?: number
  chatId?: number
  text?: string
  name?: string
  profile?: string
  time?: string
  isToday?: boolean
  align?: string
  imageContent?: Array<{}>
  isimage?: boolean
  isfile?: boolean
  fileContent?: string
  fileSize?: string
  istyping?: boolean
}
