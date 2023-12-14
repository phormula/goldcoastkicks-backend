import ModelBase from '@model/ModelBase'

class Entity extends ModelBase {
  id: number
  type: string
  name: string
  description: string

  static get tableName() {
    return 'entities'
  }
}

export default Entity
