export class NavItem {
  Id?: number
  Name: string
  iconName: string = 'speaker_notes'
  route?: string
  Children?: NavItem[]
}
