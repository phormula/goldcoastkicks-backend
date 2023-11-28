import { Model } from 'objection'

class ModelBase extends Model {
  created_at: string
  updated_at: string

  $beforeUpdate() {
    this.updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ')
  }

  $beforeInsert() {
    this.created_at = new Date().toISOString().slice(0, 19).replace('T', ' ')
  }
}

export default ModelBase
