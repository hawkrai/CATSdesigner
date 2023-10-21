export class Page<T> {
  Items: T[]
  PageInfo: PageInfo
  TotalCount: number
}

export class PageInfo {
  PageNumber: number
  PageSize: number
}
