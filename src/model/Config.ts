import { Model } from 'objection'

class Config extends Model {
  static get tableName() {
    return 'configs'
  }
}

export default Config
