import { CreateEntity } from './create-entity.model'

export class CreateNewsEntity extends CreateEntity {
  title: string
  body: string
  disabled: boolean
  isOldDate: boolean
}
