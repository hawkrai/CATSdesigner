import { PageInfo } from './page'

export class FilesPage<T> {
  Items: T[]
  PageInfo: PageInfo
  TotalCount: number
  ServerPath: string
}
