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
      user_id: string
      name: string
      description: string
      on_diet: boolean
      meal_date: string
      meal_time: string
      created_at: Date | string
      update_at: Date | string
    }
  }
}
