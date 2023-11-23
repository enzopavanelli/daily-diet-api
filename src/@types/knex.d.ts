// eslint-disable-next-line
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string
      name: string
      created_at: string
      session_id?: string
    }
    meals: {
      id: string
      session_id?: string
      name: string
      description: string
      on_diet: boolean
      meal_date: Date
      meal_time: Date
      created_at: Date
      updated_at: Date
    }
  }
}
