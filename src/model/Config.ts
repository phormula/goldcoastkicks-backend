import ModelBase from '@model/ModelBase'

class Config extends ModelBase {
  id: number
  key: string
  value: string
  table_name: string

  static get tableName() {
    return 'configs'
  }
}

export default Config
